# thinkbreak-crm implementation plan

- Status: Draft for maintainer review
- Owner: ThinkBreak
- Last reviewed: 2026-09-05
- Last verified against twenty-sdk 2.37.0: 2026-09-05

This plan develops `thinkbreak-crm` as one app in one repository. There is no
framework fork and no downstream copy. The app deploys to the maintainer's
hosted Twenty workspace, gets used there for real work, and grows from what that
use reveals.

Keep credentials, hostnames, owner IDs, form slugs, and source mappings out of
tracked files. Everything else stays in the app. A field that turns out to suit
only one company is a reason to reconsider the field, not a reason to split the
repository.

AI agents and an AI knowledge repository are a separate future project. Start
that project only after this app is deployed and in daily use.

## Fixed decisions

- Keep the current core object, relation, and view structure. Remove the landing
  page and retire custom `internalNotes` fields after preserving any existing
  values as built-in Notes.
- Keep one repository and one deployed app. Do not fork a framework copy.
- Deploy to the maintainer's hosted Twenty workspace through CD and use the app
  there. Feature ideas come from that use.
- Keep credentials, hostnames, owner IDs, form slugs, and source mappings out of
  tracked files.
- Keep the existing Deal stages. Do not rename, remap, add, or remove a stage in
  this project. The set stays Pipeline, Outreach, Appt Set, Appt Met, Quote,
  Won, and Lost.
- Keep lead attribution on Deal. Do not add Lead Source to Person or Company.
- Add a probability percentage to Deal. Set it from Deal stage.
- Use Pipeline 10, Outreach 20, Appt Set 30, Appt Met 50, Quote 75, Won 100, and
  Lost 0.
- Package the stage mapping as a logic function, the way Project's annualized
  value is packaged. Do not leave it as workflow configuration in the UI.
- Do not add weighted pipeline calculations in this release.
- Add an explicit status to Project.
- Prefer a stock Twenty field, object, subfield, relation, workflow, or view.
- Add app metadata only when no stock feature carries the value or when a
  dashboard must aggregate the value directly.
- Inherit an existing value instead of storing it twice. Each new field adds a
  migration, documentation, a possible backfill, and downstream maintenance.
- A derived CURRENCY field inherits `currencyCode` from its source field. Do not
  introduce a configured or hardcoded currency.
- Use built-in Notes and Tasks. Do not add fields that duplicate them.
- Give packaged logic functions only the record permissions they need. Do not
  grant delete permission when no packaged function deletes records.
- Build reports with Twenty views and dashboard page layouts.
- Store derived values that native dashboard widgets can sum.
- Show one current-revenue value on an annualized contract basis.
- Use stock Twenty workflows to create an email follow-up task when a new Person
  has an email address.
- Use a stock workflow branch to create a call task when that Person has a phone
  number.
- Link both tasks only to the Person.
- Make both tasks due on the next business day.
- Keep intake manual by default. Document the API contract so a website or an
  automation service can connect later with a role-scoped API key.
- Do not ship or assume an external automation platform or an app-owned webhook
  endpoint.
- Remove the packaged landing page and its navigation item.

## Current app inventory

Use `src/` as the source of truth. Keep `spec/app-features.md` synchronized with
the deployed model.

### Existing objects

- Company is a standard Twenty object. The app adds `clientStatus`,
  `primaryContact`, `deals`, `projects`, and `internalNotes`.
- Person is a standard Twenty object. The app adds the inverse primary-contact
  and junction relations, plus `internalNotes`.
- Deal is a custom object. It has `stage`, `dealType`, `billingType`, `value`,
  Company and Person relations, contact junctions, and `internalNotes`.
- Project is a custom object. It has `billingType`, `value`, dates, Company and
  Person relations, contact junctions, and `internalNotes`.
- `dealContact` and `projectContact` are junction objects. They give Deal and
  Project many contacts without creating an unsupported many-to-many relation.

### Existing views and navigation

- `src/views/deals-board.ts` defines a Deal kanban grouped by `stage`.
- `src/views/projects-list.ts` defines a Project table.
- Neither object view has a packaged navigation menu item. The maintainer adds
  both entries in the Twenty UI and chooses their positions and icons.
- The app has a packaged landing page and navigation item. Phase 2 removes
  both.

### Confirmed field findings

- Company already has `clientStatus` with Prospect, Client, and Former Client.
- Deal does not have lead attribution or a win probability.
- Deal `value` already stores an estimated annual value.
- Project `value` stores a monthly amount for Recurring projects and a full
  contract amount for Singular projects.
- Project does not have a status or a stored annualized value.

### Where work is verified

There is no local development environment and no `local` remote. Do not add one,
and do not ask the maintainer to start a server.

The verification target is the throwaway Twenty instance that CI already spawns
in `.github/workflows/ci.yml` through `spawn-twenty-app-dev-test`. Each run gets
a clean workspace, `appDevOnce` in `src/__tests__/global-setup.ts` installs the
app into it and generates the typed client, and the workspace is discarded when
the run ends. Read the plan diff and the destroy count from the CI log.

This replaces every `yarn twenty plan --remote local` gate in earlier drafts.
Where this plan says "the CI workspace" it means that instance.

- [ ] Add a CI step that fails the build when a sync reports a destroy, unless
  the run carries an explicit allowance for a reviewed retirement. `appDevOnce`
  accepts `onPlan` and `confirmApply(deleteCount)`, so this gate is automatable
  rather than a human reading a diff.
- [ ] Give the migration runner and any rehearsal job the CI workspace
  credentials through `TWENTY_API_URL` and `TWENTY_API_KEY`, which the spawn
  action already exports.

A production apply still happens only through CD in `.github/workflows/cd.yml`,
which reads its target from the `SERVER_URL` repository variable and its
key from the `TWENTY_DEPLOY_API_KEY` secret.

### Verified SDK capabilities

Checked against the `twenty-sdk` and `twenty-client-sdk` 2.37.0 type declarations
in `node_modules` on 2026-09-05. Recheck after an SDK upgrade. An item marked
unverified fits the manifest but has never reached a server. Confirm each one
against the CI workspace before you build on it.

- A logic function reads and writes records. `CoreApiClient` from
  `twenty-client-sdk/core` is a typed GraphQL client for the workspace. The
  logic-function runtime itself exports no record client, so the import comes
  from `twenty-client-sdk`, not from `twenty-sdk/logic-function`.
- `twenty-client-sdk/core` re-exports from a generated directory that the
  repository does not commit. The installed package includes fallback
  declarations whose `query` and `mutation` methods are typed as `any`. An
  import therefore typechecks before generation, but it does not validate
  workspace-specific operations. The fallback runtime throws if code executes
  it before a client is generated.
- `yarn twenty dev:generate-client` replaces the fallback with a client generated
  from a remote's schema, but nothing needs to run it by hand here. `appDevOnce`
  generates the client into `node_modules/twenty-client-sdk` as part of the
  integration setup, so CI produces it on every run. Run CI typecheck after the
  integration tests so it checks the installed app schema rather than the
  fallback.
- `defineLogicFunction` accepts `databaseEventTriggerSettings` as
  `{ eventName, updatedFields }`. A packaged function can fire on
  `project.updated` without a workflow configured in the UI.
- `FieldManifest` accepts `isUnique`. `defineIndex` also exists for a unique
  index across one or more fields.
- `FieldMetadataNumberSettings` is `{ dataType, decimals, type }`. Field metadata
  carries no minimum, maximum, or range validation.
- CURRENCY is a composite value of `{ amountMicros, currencyCode }`, not a
  number.
- Person carries composite `emails` and `phones` fields. A lookup filters on
  `emails.primaryEmail`, and a phone check reads `phones.primaryPhoneNumber`.
- `STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier` is
  `20202020-1ba1-48ba-bc83-ef7e5990ed10`, and `defineField` already targets
  standard objects in this app. The manifest can express a field on Task. No
  server has accepted one yet.
- The `WidgetType` enum has 23 members, including `AGGREGATE_CHART`, `BAR_CHART`,
  `PIE_CHART`, `LINE_CHART`, `RECORD_TABLE`, `FIELD`, and `FRONT_COMPONENT`.
  There is no `FORM_FIELD`. Trust the enum over the prose documentation, which
  lists a shorter set. `PageLayoutType` includes `DASHBOARD`, and
  `PageLayoutTabLayoutMode` includes `GRID`, the dashboard mode.
- `AggregateChartConfiguration` carries `aggregateFieldMetadataId`,
  `aggregateOperation`, its own `ChartFilter`, and `label`, `numberFormat`,
  `prefix`, and `suffix`. A stat tile needs no saved view behind it.
- `ViewFilterOperand` includes `IS_RELATIVE`, `IS_IN_PAST`, `IS_EMPTY`, and
  `IS_NOT_EMPTY`, and `ViewFilterGroupLogicalOperator` includes `OR`, so
  relative-date and missing-value views are packageable.
- A manifest renames serialized relation keys, so a `RECORD_TABLE` widget writes
  `viewUniversalIdentifier` where the runtime type says `viewId`.
- `ViewFieldManifest` accepts `aggregateOperation`, and `ViewManifest` accepts
  `filters`, `filterGroups`, `kanbanAggregateOperation`, and
  `kanbanAggregateOperationFieldMetadataUniversalIdentifier`. Aggregation lives
  in the view, so a packaged view carries its own filter and totals.

## What lives where

Two places hold configuration, and the split matters in every phase:

- **The repository** owns objects, fields, relations, views, page layouts, logic
  functions, roles, migration tooling, tests, and documentation. CD deploys it.
- **Workspace configuration** means settings created in the Twenty UI: sidebar
  entries, workflow assignees, API keys, and the business timezone. These are
  not packaged app entities, so a reinstall does not restore them. Anything that
  lives only here must also be written down in `SETUP.md`.

One business choice still blocks work. The Person follow-up workflow cannot be
configured or verified until the default assignee and the business timezone are
chosen. Everything else in Phases 3 through 5 can start now.

## Phase 1: Make the documentation reliable

Give a first-time maintainer one clear setup path and one place to check
implementation rules.

Repository: Current repository.

### Tasks

- [ ] Rewrite `SETUP.md` as a task-focused installation and operations guide.
- [ ] Keep local setup, production deployment, and troubleshooting as distinct
  sections in `SETUP.md`.
- [ ] Document the manual sidebar steps for the Deal and Project views.
- [ ] Document the package version rule. Increase `package.json` by `0.0.1` in
  the same change as every deployable metadata or application change.
- [ ] Document that this project has no local development environment. CI is the
  verification target and CD is the only path to a live workspace.
- [ ] Remove the `--remote local` and `--remote production` command examples from
  `SETUP.md`. Neither remote resolves, and the names have pointed at the wrong
  targets before.
- [ ] Document that a remote's name is not proof of its target. Any command that
  reaches a live workspace takes an explicit URL, and the operator confirms that
  URL before running it.
- [ ] State that no maintainer or agent passes `--force` to `yarn twenty apply`.
- [ ] Point `SETUP.md` and `README.md` at `AGENTS.md` instead of restating the
  implementation rules.
- [ ] Keep `AGENTS.md` and `CLAUDE.md` identical. Edit both in the same commit.
- [ ] Update `spec/app-features.md` after each model change.
- [ ] Update `spec/objects-and-views.md` when an object, field, relation, value
  rule, or view changes.
- [ ] Replace the placeholder product copy in `README.md` with a short
  description of the app and links to the setup guide, the specs, and this plan.
- [ ] Update `CHANGELOG.md` with the changes already released after `0.1.1`.

`AGENTS.md` and `CLAUDE.md` are byte-identical, and they already carry entity
creation, remotes, UUIDs, navigation, testing, versioning, and deployment. A
third copy of those rules would drift from the other two, so this plan adds no
`spec/implementation-rules.md`.

### Acceptance criteria

- [ ] A new maintainer can identify every manual Twenty UI step before running
  an apply command.
- [ ] The documentation distinguishes packaged metadata from settings that live
  only in the Twenty UI.
- [ ] The documentation uses the field names and commands that exist in the
  repository.
- [ ] Documentation-only changes do not bump the package version.

### Verification

- [ ] Compare object and field claims with `src/objects/` and `src/fields/`.
- [ ] Compare view and navigation claims with `src/views/` and
  `src/navigation-menu-items/`.
- [ ] Search the documentation for production-facing commands that name a remote
  or omit an explicit workspace URL.
- [ ] Check every relative Markdown link from the repository root.

## Phase 2: Clean the app to a reviewed baseline

Remove what should never have shipped, then tag the result. Every later phase
builds on that commit.

### Tasks

- [ ] Keep the current Company, Person, Deal, Project, `dealContact`, and
  `projectContact` structure. Leave the `internalNotes` metadata in place for
  now. Phase 3 removes it after the data migration is approved.
- [ ] Remove the landing-page front component, page layout, and navigation item.
- [ ] Remove credentials, hostnames, account IDs, owner IDs, form slugs, and
  source mappings from tracked files.
- [ ] Keep every generated identifier a valid UUID v4.
- [ ] Leave `src/fields/deal-stage.ts` alone, including its option values,
  labels, colors, positions, and `PIPELINE` default.
- [ ] Leave the `src/views/deals-board.ts` kanban groups alone. Each group pins a
  stage value to its own universal identifier, so the board and the field stay
  in step only while both are left alone.
- [ ] Keep the rule that object views do not create sidebar entries.
- [ ] Tag the reviewed baseline before Phase 3 starts.

### Acceptance criteria

- [ ] `src/fields/deal-stage.ts` and the `src/views/deals-board.ts` groups are
  unchanged from before this phase.
- [ ] Tracked files contain no secret-shaped strings or environment bindings.
- [ ] The app creates no landing page and no landing-page navigation item.
- [ ] The package identity and the CD deployment configuration still work.

### Verification

- [ ] Run `yarn typecheck`, `yarn lint`, and `yarn test:unit`.
- [ ] Run a secret scan against tracked files.
- [ ] Run the branch through CI and review the resulting plan.
- [ ] Allow only the reviewed landing-page removals in the destroy list at this
  phase. Everything else must show a destroy count of zero.
- [ ] Let the maintainer deploy and perform the visual checks.

## Phase 3: Add fields and calculation rules

Add the smallest model changes needed for intake and native reporting.

Create each entity with `yarn twenty dev:add`. Do not handwrite generated IDs.

Source and tooling are tracked. Migration state is not: the manifest, the value
export, and the rollback set belong to the live workspace and stay out of Git.

### Remove redundant `internalNotes` fields

Every object already has built-in Notes, so the Company, Person, Deal, and
Project `internalNotes` fields go away.

Implement the migration runner under `scripts/migrations/`. Use Node's built-in
`fetch`, `crypto`, and file APIs. Do not add a dependency for this one
migration.

Write the runner in TypeScript at `scripts/migrations/migrate-internal-notes.ts`.
`tsconfig.spec.json` and `vitest.unit.config.ts` both cover `scripts/`, so
`yarn typecheck` and `yarn test:unit` check the runner and its tests the way they
check `src/`. A `.mjs` file would be invisible to both, and these tests gate a
destructive production migration. Keep the runner out of `src/` so it never
reaches the built package.

Keep the parts worth testing in pure functions that take values and return
values: manifest construction, source hashing, row state transitions, and the
decision to skip, write, or stop. Confine `fetch` to a thin caller the tests do
not need.

The runner takes its target explicitly, as `--api-url` and `--api-key` or as
`TWENTY_API_URL` and `TWENTY_API_KEY`. It never reads a named remote from
`~/.twenty/config.json` and never consults `defaultRemote`. No remotes are
configured for this project, and remote names here have pointed at the wrong
targets before, so a name must not be able to select a workspace.

It refuses a missing or unparseable URL, a missing key, an apply against any URL
other than the one recorded in the approved manifest, and an apply without both
`--apply` and that manifest path. A CI rehearsal is required before a production
dry-run.

The dry-run creates an ignored local manifest under
`.local/migrations/internal-notes/`. The manifest contains one row for each
non-empty source value:

- Source object and record ID.
- SHA-256 hash of the exact source value.
- A pre-generated UUID v4 for the Note.
- A pre-generated UUID v4 for the NoteTarget relation.
- Planned Note title and target type.
- Status and timestamps for resume handling.

Keep customer note text out of the manifest. The apply command reads the source
value again and stops if its SHA-256 hash differs from the reviewed manifest.
The dry-run report may show the text for review, but it must be stored only in
the ignored migration directory and must never be committed.

On apply, use the IDs in the manifest when creating the stock Note and
NoteTarget. Both GraphQL create inputs accept caller-supplied IDs and an upsert
flag in the generated 2.37.0 schema. Create or verify the Note first. Then create
or verify its NoteTarget. Store the exact source text in `bodyV2.markdown`. If
the process stops after either write, the next run reuses the same UUID v4
values and completes the missing step instead of creating duplicates.

The completion checkpoint is an ID lookup, not a string comparison in the
runner. `NoteFilterInput.id` is a `UUIDFilter` and `RichTextFilterInput.markdown`
is a `StringFilter`, so one query settles existence and content together:

```
note(filter: { id: { eq: NOTE_UUID }, bodyV2: { markdown: { eq: SOURCE_TEXT } } })
```

A hit means that row is written and correct. Mark the row complete once that
query and the matching `noteTarget` lookup both return a record. The server
performs the comparison, so the runner carries no normalization rule of its own.
RICH_TEXT is a composite of two plain TEXT subfields, so exact equality is the
right expectation. Treat a mismatch as a stop, not as something to normalize
away.

- [ ] Add `.local/migrations/` to `.gitignore` before the runner can write state.
- [ ] Add `--dry-run`, `--apply`, `--manifest`, and `--resume` modes.
- [ ] Reject empty, missing, malformed, or changed source values before a write.
- [ ] Count non-empty `internalNotes` values for Company, Person, Deal, and
  Project.
- [ ] Produce a dry-run report that shows every source record and planned Note.
- [ ] Export the original source record IDs and exact values before production
  apply. Store the export outside Git with access limited to the operator.
- [ ] Add a CI rehearsal job that seeds a handful of records with `internalNotes`
  values in the CI workspace, then runs the migration end to end against it.
  Include a forced partial failure and a resume.
- [ ] In that rehearsal, assert that `bodyV2.blocknote` comes back non-null after
  a markdown-only write. In the SDK field-type table `blocknote` is nullable and
  optional while `markdown` is nullable and required, so a markdown-only write
  could store correct data that the editor renders as empty, and the equality
  query would still pass. Asserting on the subfield settles it headlessly, with
  no UI and no human in the loop.
- [ ] If `blocknote` comes back null, stop and decide how to populate it before
  any production dry-run. Do not guess at the block format in the runner.
- [ ] In the CI rehearsal, submit the same caller-supplied Note and NoteTarget
  IDs twice with upsert enabled. Stop the migration design if Twenty creates
  duplicates or changes either ID.
- [ ] Confirm that rerunning the same manifest creates no additional Note or
  NoteTarget records.
- [ ] Run the production dry-run against the deployed workspace, passing its URL
  explicitly as `--api-url`. Review counts, hashes, and target types without
  writing records. Never name a remote, here or anywhere else.
- [ ] Require the maintainer's explicit approval before the production apply.
- [ ] Confirm migrated Notes by count, the `bodyV2.markdown` equality query,
  relation target, and maintainer spot checks.
- [ ] Record the Note and NoteTarget IDs as the rollback set. The rollback removes
  only those created IDs and restores `internalNotes` from the protected export.
- [ ] Remove the four `internalNotes` fields only after the maintainer approves
  the migration result, rollback set, and destructive metadata plan.

A clean workspace has nothing to migrate. This migration exists only for the
deployed workspace that already holds values. Its apply is a live data change.
It is not part of installing the app and never runs during a deploy.

### Add Project fields

- [ ] Add `status` as a SELECT field.
- [ ] Use Planned, Active, On Hold, Completed, and Cancelled as the options.
- [ ] Add `annualizedValue` as a nullable CURRENCY field.
- [ ] Treat `annualizedValue` as a derived field.
- [ ] Do not edit `annualizedValue` manually.

CURRENCY contains `{ amountMicros, currencyCode }`. Apply these calculation
rules:

- If `billingType` is Recurring, set `annualizedValue.amountMicros` to
  `value.amountMicros * 12`.
- If `billingType` is Singular, set `annualizedValue.amountMicros` to
  `value.amountMicros`.
- Copy `value.currencyCode` into `annualizedValue.currencyCode`.
- If `billingType` or `value` is empty, set `annualizedValue` to empty.
- Recalculate the field after `billingType` or `value` changes.

`amountMicros` is an integer, and multiplying it by 12 stays exact, so Project
needs no rounding rule.

### Add Deal fields

- [ ] Add `probability` as a nullable NUMBER field that stores the percentage for
  the Deal's current stage.
- [ ] Add `leadSource` as a SELECT field.
- [ ] Ship Website Form (`WEBSITE_FORM`), Manual (`MANUAL`), Business Card
  (`BUSINESS_CARD`), and Other (`OTHER`) as the initial Lead Source options.
- [ ] Allow workspace owners to add their own Lead Source options through
  Twenty's standard data-model settings.
- [ ] Add `intakeSubmissionId` as a nullable TEXT field with `isUnique: true`.
- [ ] Keep `intakeSubmissionId` empty for manually created Deals.
- [ ] Do not add fields for a form slug, raw request, intake summary, or
  organization-specific intake context.
- [ ] Rehearse option preservation in CI. Add a Lead Source option through the
  metadata API, sync the app again, and assert that the option survives and that
  the plan does not remove it. Record the result here. The Lead Source
  extensibility promise in Phase 6 rests on this behavior, so prove it before the
  release depends on it.

Keep `probability` as a NUMBER. A packaged logic function updates it when
`stage` changes. The field stores the stage probability for filtering and
display. This release does not calculate or store a weighted Deal value.

`intakeSubmissionId` carries idempotency, so it needs an index and a uniqueness
constraint. Manual Deal entry does not use the field. An external integration
uses it as the stable key for a submitted Deal.

Use Twenty's built-in Notes for free-form intake context. A Note stays
searchable, appears on the timeline, and avoids another Deal field. An external
integration may create a Note, but nothing requires one.

Use this stage-to-probability mapping:

| Stage    | Probability |
| -------- | ----------- |
| Pipeline | 10          |
| Outreach | 20          |
| Appt Set | 30          |
| Appt Met | 50          |
| Quote    | 75          |
| Won      | 100         |
| Lost     | 0           |

These are conventional starting values, not measured ones. The shape follows the
standard sales curve. A lead that merely exists is worth little, a booked
meeting beats an attempted call, a held meeting roughly doubles the odds again,
and a delivered quote carries most of the way. Recalculate the five open stages
from real per-stage win rates once about 30 Deals have reached Won or Lost, and
treat that recalibration as a change to the mapping in source.

Adding or renaming a stage means editing the mapping in the same change.

Field metadata cannot enforce the 0 through 100 range. The mapping is a constant
in source, the unit tests cover every stage, and nothing else writes the field.
Do not use `probability` for forecasting calculations in this release.

### Add Task idempotency metadata

Stock Tasks have no integration-owned unique key that a workflow can use for an
idempotent upsert. Add one generic field rather than fields tied to a form or an
automation product.

- [ ] Confirm that the installed Twenty server accepts a field on the standard
  Task object by syncing the manifest in CI and reading the plan.
- [ ] Add `automationKey` as a nullable TEXT field with `isUnique: true`.
- [ ] Use `defineIndex` instead if the server rejects a unique field manifest.
- [ ] Leave `automationKey` empty on manually created Tasks.
- [ ] Hide `automationKey` from normal Task views.
- [ ] Use `<person-id>:new-person-email` and
  `<person-id>:new-person-call` for the follow-up workflow.

The nullable field does not change manual Task entry. Its uniqueness constraint
lets a workflow or external integration upsert the same Task after a retry
without relying on an editable title.

### Add calculation logic

Two packaged logic functions maintain derived values: Project `annualizedValue`
and Deal `probability`. Neither needs workflow configuration in the Twenty UI.
`defineLogicFunction` accepts `databaseEventTriggerSettings`, and `CoreApiClient`
from `twenty-client-sdk/core` performs the record read and write.

Deal probability is a lookup rather than a calculation, but it belongs in source
for the same reason the Project formula does. A mapping clicked into the Twenty
UI is invisible to code review, absent from the unit tests, and gone after a
workspace rebuild. Both functions share one trigger pattern, one equality guard,
and one test file.

The installed SDK fallback lets imports of `CoreApiClient` typecheck with
`query` and `mutation` typed as `any`. That result is not a meaningful schema
check, so a typecheck on a fresh clone proves nothing about these functions. CI
is where the check has meaning, because `appDevOnce` generates a real client
there first.

In CI, keep the current integration-test setup that runs `appDevOnce`. A
successful sync generates the client from the installed test-workspace schema.
Run CI typecheck after the integration tests, not before them. Add a guard that
fails if the generated schema does not contain Project `annualizedValue` and
Deal `probability`. Do not commit generated SDK files and do not weaken the
custom-object boundary to `any`.

- [ ] Scaffold each function with `yarn twenty dev:add logicFunction`.
- [ ] Trigger the Project function on `project.created` and on
  `project.updated` scoped to `updatedFields: ['billingType', 'value']`.
- [ ] Trigger the Deal function on `deal.created` and on `deal.updated` scoped to
  `updatedFields: ['stage']`.
- [ ] Keep the stage mapping in one exported constant that the function and its
  tests both import.
- [ ] Stop with an actionable error on a stage that the mapping does not cover.
  Do not leave a stale probability and do not guess a value.
- [ ] Return without writing when the computed value already equals the stored
  value.
- [ ] Prefer the last write when a record changes while the function runs. Do not
  retry a calculation that a newer event supersedes.
- [ ] Leave the derived field empty when a calculation fails. Never write a stale
  or partial value.
- [ ] Move the CI typecheck step after the integration-test step.
- [ ] Verify that CI typecheck uses a generated schema containing Project
  `annualizedValue` and Deal `probability`, not the fallback declarations.
- [ ] Document each function, its trigger, and its failure modes in `SETUP.md`.

Writing a derived field raises the same object's update event again, so either
function can trigger itself. Two guards stop the loop. The `updatedFields`
filter is the first. The equality check above is the second.

### Restrict the application role

Define the packaged function before finalizing its role. Scope permissions to
the objects and fields it actually reads or updates.

- [ ] Use `objectPermissions` and `fieldPermissions` in `RoleConfig`.
- [ ] Grant read access to the Project source fields and to Deal `stage`.
- [ ] Grant update access only to Project `annualizedValue` and Deal
  `probability` if Twenty accepts that field-level restriction.
- [ ] Do not grant create, delete, destroy, restore, or soft-delete permissions.
- [ ] Confirm the exact role diff in the CI plan output.

### Handle existing records

This applies to the deployed workspace, not to the packaged app.

- [ ] Count existing Project and Deal records before applying new defaults.
- [ ] Produce a dry-run report for Projects that need a status.
- [ ] Ask the maintainer to assign the missing Project statuses. Do not infer
  statuses from other fields.
- [ ] Calculate `annualizedValue` only after the maintainer confirms the source
  fields.
- [ ] Backfill Deal `probability` by touching each Deal so the packaged function
  writes it, or with a one-off script that imports the same mapping constant.

### Acceptance criteria

- [ ] Each of the seven Deal stages sets its mapped probability, with Won at 100
  and Lost at 0.
- [ ] An unmapped stage reports an actionable error instead of leaving a stale
  probability.
- [ ] Project `annualizedValue` matches the formula in this plan, computed in
  `amountMicros`.
- [ ] A missing source value cannot produce a misleading zero.
- [ ] Existing live records retain their business values.
- [ ] The application role cannot delete records.
- [ ] The model change increments the package version by `0.0.1`.

### Verification

- [ ] Add unit tests for Recurring, Singular, empty, zero, and decimal values.
  Assert on `amountMicros` integers, not on display amounts.
- [ ] Add a unit test that asserts the probability for all seven stages and a
  stop for an unknown stage value.
- [ ] Have the maintainer move one Deal through two stages in the workspace and
  confirm that `probability` follows.
- [ ] Add a test that the calculation is idempotent. Running it twice on the same
  record produces one write, not a loop.
- [ ] Keep the calculation itself in a pure function that the unit tests import
  without a server or a generated client.
- [ ] Add migration-runner tests for dry-run zero writes, a retry whose Note and
  NoteTarget IDs already resolve, a failure after Note creation, a failure after
  NoteTarget creation but before checkpoint completion, an equality query that
  returns no record, a changed source hash, malformed IDs, and an empty source
  set.
- [ ] Verify that the rollback set contains only IDs created by the reviewed
  manifest.
- [ ] Run the integration tests before typecheck in CI so `appDevOnce` installs
  the schema and generates the workspace client.
- [ ] Run `yarn typecheck`, `yarn lint`, and `yarn test:unit`.
- [ ] Review the metadata diff in the CI plan output.
- [ ] Except for the reviewed `internalNotes` retirement, confirm that the
  destroy count is zero before the maintainer applies the change.
- [ ] For `internalNotes`, confirm that the destroy list, migrated-record count,
  and verified restore path match the approved migration plan.

## Phase 4: Add the follow-up workflow and the integration contract

Keep record intake manual by default. The app supplies the fields and rules an
optional integration needs. It supplies no webhook, website adapter, or
automation-platform blueprint.

The integration contract can be written now. The Person workflow waits for an
approved assignee and business timezone.

### Configure the Person follow-up workflow

Twenty saves manually entered People before all fields are filled. A workflow
that listens only for `person.created` can run before an email address or phone
number exists. Use `Record is Created or Updated`. Watch `emails` and `phones`.
The maintainer configures this workflow in the Twenty UI.

This one stays in the UI, unlike the Deal probability function. It needs an
assignee, which is a workspace member ID rather than a rule, and it needs the
business timezone. Both belong to the workspace, not to source. `SETUP.md`
carries the steps.

- [ ] Document the workflow setup in `SETUP.md`. Full workflows are workspace
  configuration and are not packaged app entities.
- [ ] Add one Code action that returns both Task keys and the next-business-day
  due date.
- [ ] Add an email-task branch that runs when the Person has a primary email.
- [ ] Upsert the email Task by `automationKey` using
  `<person-id>:new-person-email`.
- [ ] Add a call-task branch that runs only when the Person has a primary phone
  number.
- [ ] Upsert the call Task by `automationKey` using
  `<person-id>:new-person-call`.
- [ ] Link each Task only to the Person that triggered the workflow.
- [ ] Assign both Tasks to the workspace member selected during setup.
- [ ] Make each Task due on the next business day in the workspace's configured
  business timezone.
- [ ] Skip Saturdays and Sundays. Do not add a holiday calendar in the first
  release.
- [ ] Do not send an email or place a call. The workflow creates Tasks only.

Both branches use stock record triggers, filters, Code, and Task upserts. The
Code action constructs `automationKey` and the next-business-day due date.

### Write the optional integration contract

- [ ] Add `spec/intake-contract.md`.
- [ ] Describe integration through Twenty's generated REST or GraphQL API.
- [ ] Document how to create an API key and assign it a least-privilege role.
- [ ] Do not prescribe an automation platform, a website payload, or an
  app-owned endpoint.
- [ ] Define required, optional, nullable, and ignored values for a generic lead
  intake.
- [ ] Require a stable `intakeSubmissionId` for every automated Deal intake.
- [ ] Define Person, Company, Deal, contact-junction, and optional Note mappings.
- [ ] Define every stop, retry, and manual-review outcome.

### Keep external writes safe to retry

This app documents the contract. Each optional integration project owns its own
code, boundary validation, and orchestration. The app owns the schema
constraints that make a correct integration possible.

Process records in this order:

1. Validate the external payload before writing any CRM record.
2. Upsert Person by the stock unique primary email.
3. If a Company domain is available, upsert Company by the stock domain field.
4. If only a Company name is available, search by normalized exact name.
5. If more than one Company matches, stop for manual review.
6. Upsert Deal by `intakeSubmissionId`.
7. If the packaged default stage applies, omit `stage` from the write.
8. Add the Company, primary Person, and contact-junction relations without
   duplicating an existing relation.
9. Create a built-in Note only when the integration has useful free-form context
   that does not belong in a stock field.

Apply these boundary rules:

- Before an automated write, reject a missing `intakeSubmissionId` or an ID that
  does not match the integration's documented format.
- Validate names, email addresses, and any other required values before querying
  Twenty.
- Do not overwrite a populated CRM field with an empty external value.
- Map Website Form, Manual, Business Card, or Other only when that value matches
  the installed Lead Source options.
- Require an administrator to add any new Lead Source option before an
  integration sends its API value.
- Keep raw request IP addresses, user-agent values, full payloads, and secrets
  outside the CRM unless the workspace owner approves a documented use.
- Retry a rate limit or transient server failure a limited number of times.
- On a retry after a partial failure, query the unique keys again and create only
  missing records or relations.
- Stop for manual review instead of guessing when Person or Company matching is
  ambiguous.

The nullable `intakeSubmissionId` does not affect manual Deals. People use their
stock unique email, Companies use their stock domain when available, and
automated Deals use `intakeSubmissionId`. These keys let a later integration
recover from a partial failure without adding an intake service to the app.

### Governance gate for an optional integration

Owner: Each optional integration project.

Any installed integration that handles personal data and writes to a production
CRM needs its own owner, tests, review, credentials, and activation decision.
These belong to the integration project, not to this package.

- [ ] Keep each new integration inactive until its mappings and error paths are
  reviewed.
- [ ] Require a human to approve production activation.
- [ ] Store API keys outside tracked files and scope each key to the minimum
  required role.
- [ ] Document any behavior that remains unverified before activation.

### Acceptance criteria

- [ ] When a Person first gains a primary email, the workflow creates one email
  Task.
- [ ] When a Person first gains a primary phone number, the workflow creates one
  call Task.
- [ ] Repeated Person updates do not duplicate either Task.
- [ ] Both Tasks link only to the Person.
- [ ] Manually created Deals do not require `intakeSubmissionId`.
- [ ] The integration contract explains duplicate protection, partial retries,
  boundary validation, and manual review without assuming an integration tool.
- [ ] The repository contains no API key, webhook URL, external connection, or
  organization-specific mapping.

### Verification

#### Maintainer workflow checks

The maintainer performs these checks in the Twenty UI. Agents do not start a
server, configure the UI, activate workflows, drive the browser, or take
screenshots.

- [ ] Test the email branch with and without a primary email.
- [ ] Test the call branch with and without a primary phone number.
- [ ] Test repeated Person updates.
- [ ] Test a failure after one Task upsert succeeds but before the other branch
  finishes.
- [ ] Test Friday intake dates and weekend skipping.

#### Field and integration checks

- [ ] Have the maintainer create two manual Deals with empty
  `intakeSubmissionId` values. Confirm that the uniqueness constraint permits
  normal manual use.
- [ ] Review the integration contract against REST and GraphQL API behavior.
- [ ] Test a sample integration outside this repository with valid, duplicate,
  malformed, ambiguous, and partial-failure fixtures before calling the contract
  proven.

## Phase 5: Package native Twenty reporting

Numbers are tiles, comparisons are bars, and records are tables. Match the
widget to the job the reader has, rather than rendering every metric the same
way.

`WidgetType` in twenty-sdk 2.37.0 has 23 members, not the four this plan once
listed. `FORM_FIELD` is not among them. The types this dashboard uses are
`AGGREGATE_CHART`, `BAR_CHART`, and `RECORD_TABLE`. Verified configuration
shapes:

- `AggregateChartConfiguration` is `BaseChartConfiguration` plus `label`,
  `numberFormat`, `prefix`, and `suffix`. `BaseChartConfiguration` carries
  `aggregateFieldMetadataId`, `aggregateOperation`, and its own `filter`, so a
  stat tile needs no saved view behind it.
- `AggregateOperations` includes `SUM`, `COUNT`, `AVG`, and
  `COUNT_UNIQUE_VALUES`.
- `ChartFilter` is `{ recordFilters, recordFilterGroups }`, so a tile's filter is
  packaged rather than clicked.
- `RecordTableConfiguration` takes `viewId` and `recordLimit`. In a manifest,
  `FormatRecordSerializedRelationProperties` renames that key, so a packaged
  widget writes `viewUniversalIdentifier`.
- `ViewFieldManifest` accepts `aggregateOperation`, and `ViewManifest` accepts
  `filters`, `filterGroups`, `kanbanAggregateOperation`, and
  `kanbanAggregateOperationFieldMetadataUniversalIdentifier`.
- `ViewFilterOperand` includes `IS_RELATIVE`, `IS_IN_PAST`, `IS_EMPTY`, and
  `IS_NOT_EMPTY`. `ViewFilterGroupLogicalOperator` includes `OR`. Relative dates
  and missing-value filters are therefore packageable.

Do not put a headline number in a table footer. A `RECORD_TABLE` truncates its
rows to `recordLimit`, so a total printed under a partial list reads as the sum
of the visible rows. `AGGREGATE_CHART` states the number plainly and filters
itself.

Do not build the dashboard by hand in the Twenty UI. A packaged dashboard
survives a reinstall and reaches every environment. Someone has to rebuild a
hand-built dashboard from `SETUP.md` every time.

See the Twenty documentation for
[page layouts](https://docs.twenty.com/developers/extend/apps/layout/page-layouts)
and [dashboard widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets).

### Define the metrics

- [ ] Define Current revenue as the sum of `annualizedValue` for Active Projects.
- [ ] Label it `Current revenue, annualized contract basis`.
- [ ] Define Projected revenue as the sum of Deal `value` for open Deals.
- [ ] Define Open deals as the count of Deals excluding Won and Lost.
- [ ] Define Lead source mix as Deal count grouped by `leadSource`.
- [ ] Define Revenue by billing type as the sum of `annualizedValue` for Active
  Projects grouped by `billingType`.

Current revenue is a contract-value metric. It is not earned revenue, cash
received, or an accounting report. A future invoice or payment integration must
own those definitions.

A native `SUM` over a CURRENCY field adds `amountMicros` and ignores
`currencyCode`. These metrics are correct only while the workspace uses one
currency. Carry that assumption in the tile's `label` or `suffix` so it travels
with the number. Revisit the metric definitions before the workspace adds a
record in a second currency.

### Build the first dashboard

Scaffold each view with `yarn twenty dev:add view` and each field with
`yarn twenty dev:add viewField`. Build the page layout and its tab with
`yarn twenty dev:add pageLayout` and `yarn twenty dev:add pageLayoutTab`.

Define one `DASHBOARD` page layout with a `GRID` tab, holding eight widgets in
three bands.

Band 1, the numbers, as `AGGREGATE_CHART` tiles. Each carries its own
`ChartFilter`, so none of them needs a view:

- [ ] Current revenue. `SUM` on Project `annualizedValue`, filtered to `status`
  Active. Give it the largest grid position on the tab.
- [ ] Projected revenue. `SUM` on Deal `value`, filtered to exclude Won and Lost.
- [ ] Open deals. `COUNT` of Deals, filtered to exclude Won and Lost.

Band 2, the comparisons, as horizontal `BAR_CHART` widgets:

- [ ] Lead source mix. `COUNT` of Deals grouped by `leadSource`.
- [ ] Revenue by billing type. `SUM` on `annualizedValue` for Active Projects
  grouped by `billingType`.
- [ ] Run both horizontally. `Website Form` and `Business Card` are long labels
  that crowd under vertical columns.
- [ ] Give each chart a single color. Bar length carries the comparison, these
  categories are not identities tracked across charts, and one hue per chart
  stays legible for colorblind readers. Do not use a pie chart for either.
  Billing type has two categories, which a pie renders as a shape you have to
  read twice.

Band 3, the worklists, as `RECORD_TABLE` widgets over packaged views. These are
the widgets where the rows are the point, because the reader clicks through to
act on them:

- [ ] Renewals due. One Project view filtered to `endDate` within 90 days, sorted
  by `endDate` ascending. One view replaces the separate 30, 60, and 90 day
  views, which showed the same projects three times. Sorting puts the soonest
  first.
- [ ] Overdue follow-ups. One Task view covering both the email and call Tasks.
- [ ] Data quality. One Project view for records missing `status`, `billingType`,
  or `value`, using `IS_EMPTY` filters in an `OR` filter group.
- [ ] Give each widget a `recordLimit` that keeps its card readable.
- [ ] Stop at these eight widgets. A ninth tile counting the data-quality rows
  would restate what that table already shows.

Then finish the Deals board:

- [ ] Set `kanbanAggregateOperation` to `SUM` on `value` for the existing Deals
  board in `src/views/deals-board.ts`, so each stage column shows its total.
- [ ] Show `probability` on the Deals board.
- [ ] Do not add a navigation menu item. The maintainer adds the sidebar entry by
  hand, as with every other object view.

### Add later metric candidates

Do not add these until the required history exists:

- Weighted projected revenue.
- Deal win rate.
- Average Deal value.
- Average time in each Deal stage.
- Lead-source conversion rate.
- Revenue won by lead source.
- Automated-intake response time.
- Projects near completion with no follow-on Deal.

### Acceptance criteria

- [ ] Every first-release metric appears on the dashboard.
- [ ] Each widget type appears in the `WidgetType` enum of the installed SDK.
- [ ] Every headline number is an `AGGREGATE_CHART` tile, not a table footer.
- [ ] The whole dashboard is packaged metadata. `SETUP.md` documents no manual
  widget building, only the sidebar entry.
- [ ] The Current revenue tile equals `Recurring value * 12 + Singular value`
  for Active Projects.
- [ ] View filters exclude Won and Lost Deals from open pipeline metrics.
- [ ] The Deal board displays the stage-derived `probability` without calculating
  a weighted value.
- [ ] Data-quality views expose Projects omitted from derived-value totals.

### Verification

- [ ] Prepare a small fixture set with known Project and Deal values. Include one
  Project missing `billingType`, so the data-quality view has something to catch.
- [ ] Calculate the expected metric values outside Twenty.
- [ ] Confirm that `annualizedValue` holds values before you read Current revenue.
  An unfinished backfill produces a wrong total instead of an error.
- [ ] Confirm in CI that the destroy count is zero before the views and the page
  layout reach a live workspace.
- [ ] Let the maintainer inspect the applied dashboard and compare each tile,
  bar, and table against the expected value.
- [ ] Quote no number from a table footer or a kanban column total. Every number
  anyone reports comes from an `AGGREGATE_CHART` tile, which carries its own
  filter and no row limit. That rule settles the footer-scope question instead
  of waiting on an answer to it.
- [ ] Have the maintainer compare the Deals board column totals against the
  Projected revenue tile once. If a column sums only loaded rows, record the
  board totals as indicative in `SETUP.md` and leave them as a working aid.
- [ ] Do not use browser automation, screenshots, or end-to-end UI tests.

## Phase 6: Deploy the app and build on it

Deploy the reviewed version to the hosted workspace and start using it. This
phase does not end, and that is the point. The feature list after this comes
from real use rather than from this plan.

### Prepare the release

- [ ] Confirm that tracked files hold no credentials, hostnames, owner IDs, or
  form slugs.
- [ ] Add the Deal, Project, and dashboard sidebar entries by hand in the Twenty
  UI. Record the positions and icons in `SETUP.md`.
- [ ] Document which workflows the maintainer configures in the UI after a
  deploy.
- [ ] Document how to add a Lead Source option and how an integration uses its
  API name.
- [ ] Tag the reviewed version.

### Run it and learn from it

- [ ] Install the reviewed version into a clean CI workspace first.
- [ ] Deploy the same version to the hosted workspace through CD.
- [ ] Confirm that the deploy removes the old landing-page component, page
  layout, and navigation item shown in the reviewed metadata plan.
- [ ] Use the app for real work: real Deals, real Projects, real follow-up Tasks.
- [ ] Keep a dated list of friction and missing features in
  `spec/app-features.md`, and take the next release's scope from it.
- [ ] Keep API keys, owner IDs, and workflow assignments out of tracked files.

### Acceptance criteria

- [ ] A clean CI workspace and the hosted workspace receive the same fields,
  relations, functions, and views.
- [ ] The package installs with no landing page.
- [ ] A Lead Source option added in the Twenty UI survives a redeploy, together
  with the records that use it. Treat a failed preservation check as a release
  blocker.
- [ ] Manual CRM use requires no API key or external integration.

### Verification

- [ ] Run `yarn typecheck`, `yarn lint`, and `yarn test:unit`.
- [ ] Review the CI plan diff.
- [ ] Review every destroy before the maintainer deploys. Allow only the approved
  landing-page and migrated `internalNotes` removals.
- [ ] Let the maintainer perform the clean installation and visual review.
- [ ] Add a Lead Source option with a test record, redeploy, and confirm that the
  option and the record value remain intact.
- [ ] Record operational findings once the app is in active use.

## Release rules for every phase

Apply these rules to each implementation phase:

1. Read `AGENTS.md`, `spec/app-features.md`, and the relevant design spec.
   `CLAUDE.md` is a byte-identical copy of `AGENTS.md`, so read either file.
2. Inspect the target file and nearby usage before editing.
3. Use an existing component, helper, or pattern when one fits.
4. Scaffold new Twenty entities with `yarn twenty dev:add`.
5. Keep generated UUIDs as valid UUID v4 values.
6. If you edit `AGENTS.md` or `CLAUDE.md`, make the same edit in both files.
7. Update the relevant spec in the same change as behavior or metadata.
8. Increase the package version by `0.0.1` for a deployable change.
9. Run the narrowest static and unit checks that cover the change.
10. Review the CI plan output before anything reaches a live workspace.
11. Confirm that the destroy count is zero unless the phase contains an explicit
    retirement with a reviewed migration and verified restore path.
12. Let the maintainer run servers, apply metadata, inspect the UI, and activate
    high-risk workflows.
13. Record unfinished and unverified work in this file before closing the phase.

## Review decisions still needed

Do not treat this section as one project-wide blocker. Record each decision
before the named gate.

Before Phase 3 Task metadata:

- [ ] Fallback idempotency method if Task cannot accept `automationKey`.
- [ ] Whether Manual is the default Lead Source or remains an explicit selection.

Before Phase 4 Person workflow configuration:

- [ ] Default assignee for new-Person follow-up Tasks.
- [ ] Business timezone for next-business-day calculations.

## Recorded decisions

Do not reopen these decisions without new evidence:

- One repository, one app. The framework fork and the downstream copy are
  cancelled. Keeping the app general is a constraint on what goes into it, not a
  reason to split it.
- A packaged logic function calculates Project `annualizedValue` with
  `databaseEventTriggerSettings` and `CoreApiClient`. A fresh install's fallback
  declarations are not a workspace-schema check. The integration setup generates
  the real client, so CI runs typecheck after that setup installs the app.
- Packaged views provide the dashboard filters and aggregate footers.
  `RECORD_TABLE` widgets embed those views. Do not build the dashboard by hand in
  the Twenty UI.
- `spec/implementation-rules.md` is not needed. `AGENTS.md` already holds those
  rules.
- A derived CURRENCY field inherits `currencyCode` from its source.
- Deal `probability` stays a plain NUMBER that a packaged logic function fills
  from the stage mapping in source. Defer weighted pipeline calculations.
- Stage probabilities are Pipeline 10, Outreach 20, Appt Set 30, Appt Met 50,
  Quote 75, Won 100, and Lost 0. Recalibrate from measured win rates, not from
  opinion.
- No reported number comes from a table footer or a kanban column total. Every
  headline figure is an `AGGREGATE_CHART` tile.
- Deal stages stay exactly as `src/fields/deal-stage.ts` defines them. No phase
  renames, remaps, adds, or removes a stage, so no phase touches the packaged
  kanban groups that pin those values.
- Lead Source starts with Website Form, Manual, Business Card, and Other. More
  can be added through Twenty's data-model settings.
- Manual intake is the default. The app documents an API contract but ships no
  webhook or automation-platform implementation.
- Built-in Notes store free-form context. The app adds no intake-summary,
  form-slug, or raw-request field.
- Stock workflows create the email and conditional call Tasks. Both Tasks link
  only to Person.
- Remove the landing page and its navigation item before release.
- Start AI work as a separate project after the app is deployed and in active
  use.
