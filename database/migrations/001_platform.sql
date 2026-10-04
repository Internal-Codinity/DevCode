-- PostgreSQL 15+ schema for Codura. Apply with `npm run db:migrate` before
-- starting the web process or judge worker. Migrations are deliberately
-- transactional and are recorded by scripts/migrate.ts.

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_lowercase CHECK (email = lower(email)),
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_display_name_length CHECK (char_length(display_name) BETWEEN 2 AND 80)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_hash TEXT,
  user_agent_hash TEXT
);
CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_expires_at_idx ON user_sessions(expires_at);

CREATE TABLE IF NOT EXISTS account_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('verify_email', 'reset_password')),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS account_tokens_lookup_idx ON account_tokens(token_hash, purpose, expires_at);

CREATE TABLE IF NOT EXISTS auth_attempts (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL CHECK (action IN ('register', 'login', 'password_reset')),
  identifier_hash TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS auth_attempts_window_idx ON auth_attempts(action, identifier_hash, attempted_at DESC);

CREATE TABLE IF NOT EXISTS problems (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  example_input TEXT,
  example_output TEXT,
  constraints JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS problems_published_idx ON problems(is_published, difficulty, category);

-- Test inputs and expected output must only be read by the worker. The public
-- API intentionally never selects this table.
CREATE TABLE IF NOT EXISTS problem_test_cases (
  id UUID PRIMARY KEY,
  problem_id TEXT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  name TEXT NOT NULL,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('sample', 'hidden')),
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT problem_test_cases_problem_ordinal_unique UNIQUE(problem_id, ordinal)
);
CREATE INDEX IF NOT EXISTS problem_test_cases_problem_idx ON problem_test_cases(problem_id, ordinal);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL REFERENCES problems(id),
  language TEXT NOT NULL CHECK (language IN ('python', 'javascript')),
  source_code TEXT NOT NULL,
  judge_scope TEXT NOT NULL DEFAULT 'all' CHECK (judge_scope IN ('sample', 'all')),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'cancelled', 'internal_error')),
  verdict_message TEXT,
  tests_total INTEGER NOT NULL DEFAULT 0,
  tests_passed INTEGER NOT NULL DEFAULT 0,
  runtime_ms INTEGER,
  memory_kb INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancel_requested_at TIMESTAMPTZ,
  worker_id TEXT,
  lease_expires_at TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT submission_source_code_size CHECK (octet_length(source_code) <= 262144),
  CONSTRAINT submissions_test_counts_valid CHECK (tests_total >= 0 AND tests_passed >= 0 AND tests_passed <= tests_total)
);
CREATE INDEX IF NOT EXISTS submissions_queue_idx ON submissions(status, created_at) WHERE status = 'queued';
CREATE INDEX IF NOT EXISTS submissions_user_problem_idx ON submissions(user_id, problem_id, created_at DESC);

CREATE TABLE IF NOT EXISTS submission_test_results (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  test_case_id UUID NOT NULL REFERENCES problem_test_cases(id),
  ordinal INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'runtime_error', 'timed_out', 'cancelled')),
  runtime_ms INTEGER,
  memory_kb INTEGER,
  stderr TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT submission_test_results_unique UNIQUE(submission_id, test_case_id)
);

-- Payloads exposed over SSE never include a hidden test's input, expected
-- output, or actual output. They are an append-only audit trail too.
CREATE TABLE IF NOT EXISTS submission_events (
  id BIGSERIAL PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('status', 'progress', 'test', 'complete')),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS submission_events_stream_idx ON submission_events(submission_id, id);
