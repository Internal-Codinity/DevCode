Audit complete: this is currently a real local code runner wrapped in a largely prototype/demo product.

The good news: `/api/run` genuinely executes Docker jobs and streams output; I verified a submitted Python program ran successfully. It is not browser-side faking.

The main problem page has these critical gaps:

- The visible **Submit** button does not submit anything—it only shows a toast. [Problem page](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/app/problems/[id]/page.tsx:273)
- “Save submission” writes a code snapshot to `localStorage`; it records no verdict, runtime, memory, user, or server history. [Code editor](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/components/code-editor.tsx:202)
- “Run all tests” loops only over the public fixtures bundled in the frontend. There are exactly three problems and two exposed cases per problem—no hidden suite, batching, submission queue, or aggregate judge result. [Fixture data](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/data/problems.ts:3)
- Expected input/output are shipped to the browser, so they cannot serve as hidden tests. Grading is simple normalized stdout-string equality.
- “Solved” on `/problems` means merely “a local snapshot exists,” not “passed.” [Problems list](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/app/problems/page.tsx:22)
- `/problems/1` is invalid, but silently renders the first problem rather than returning 404—so many bad links appear to work while showing the wrong challenge. [Fallback](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/app/problems/[id]/page.tsx:41)
- The plain textarea is not a LeetCode-grade editor: no syntax intelligence, formatting, keyboard shortcuts, test-case management, submissions/results comparison, or language ecosystem beyond Python and JavaScript.
- “Run code” and the advanced runner do not provide the fixture input file, while “Run tests” does. That makes the documented `test_input.txt` workflow inconsistent.

The runner is still development-only in important ways:

- Job state, events, rate limits, logs, and artifacts are in one process’s memory and disappear after 15 minutes; it needs durable shared services before scaling. [Runner documentation](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/docs/isolated-runner.md:38)
- Production requires a separate authenticated gateway; the repository itself has no users, sessions, database, submission service, or per-user authorization. [Production requirements](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/docs/isolated-runner.md:34)

Elsewhere in the app, these are mock/static or underdeveloped:

- Navbar: fixed “Jane Doe,” placeholder avatar, static notifications, inert search, and inert account actions (Progress, Solutions, History, Settings, Log out). [Navbar](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/components/navbar.tsx:43)
- Profile, leaderboard, discussions, articles, home metrics, tracks, companies, courses, and recommendations are hard-coded sample data. No real social, ranking, reputation, analytics, or account data exists.
- Problem discussions, likes, bookmarks, drafts, contest registration, and settings are browser-local only; no cross-device persistence or shared community content.
- Tracks show fixed completion/locks/rewards; Start/Continue only displays a toast and does not open a level. [Track detail](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/app/tracks/[id]/page.tsx:19)
- Time-boxed and code-quality challenges only filter static cards; Start Challenge does not start a timer, load a workspace, or evaluate work.
- Hackathons are mock data (including stale 2025 dates), registration/team/comment actions are in-memory/toast-only, resources use `#`, and every `/hackathons/<anything>` renders the same Data Visualization hackathon. [Hackathon detail](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/app/hackathons/[id]/page.tsx:42)
- The collaboration UI simulates collaborators, typing, chat, invitations, video, and microphone state; it has no real-time transport or identity layer.
- Several pages are presentational-only: Explore’s “trending” list is randomized on the client; filter buttons and many sort/action buttons are inert.

Navigation is materially incomplete:

- `/sheets`, `/companies`, `/courses`, `/profile/<username>`, `/discuss/<id>`, `/discuss/articles/<id>`, `/contests/<id>`, `/problems/category/<id>`, `/challenges/time-boxed/<id>`, and `/tracks/project-chains/<id>` return 404.
- Some invalid dynamic URLs instead render a fallback item, which is worse than a 404: tracks fall back to the first track, problems fall back to the first problem, and hackathons render the same mock event.

Engineering readiness also needs work:

- `npm run lint` fails: there is no ESLint config/project-local ESLint setup.
- `tsc --noEmit` reports type errors across Discuss, Explore, Profile, the chart component, and category list.
- Production builds still pass because TypeScript errors are explicitly ignored. [Next config](/media/sagesujal/DEV1/bytes/CODUNITY/codium/leetcode-clone-project/next.config.mjs:3)
- There is no test script or automated API/UI test suite.

Priority order I’d use: real authentication/database → problem/submission schema → hidden-test judge and persisted verdicts → replace local “solved” state → correct routing/404s → remove or clearly label the remaining demo sections.