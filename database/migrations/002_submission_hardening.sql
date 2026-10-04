-- Keep production submission rate checks efficient as the history grows.
CREATE INDEX IF NOT EXISTS submissions_user_created_idx ON submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_reclaim_idx ON submissions(lease_expires_at, created_at) WHERE status = 'running';
