# thinkbreak-crm implementation plan

- Status: Active implementation and maintainer verification
- Owner: ThinkBreak
- Last reviewed: 2026-09-10
- Pinned SDK and CI server version: 2.37.0
- Last hosted CI verification: 2026-09-06

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

- Keep the current core object, relation, and view structure. The landing page
  and custom `internalNotes` fields have been retired. The maintainer approved
  removal without a data migration.
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
- Store Company industries as records in a custom Industry object. Do not seed
  Industry records from the app package.
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
- Store annualized values for record-level views and aggregate widgets.
- Package current revenue as the sum of `annualizedValue` for Active Projects.
- Configure an inactive stock Twenty workflow in the workspace to create an
  email follow-up Task when a Person gains an email address.
- Use a branch in that workflow to create a call Task when the Person gains a
  phone number.
- Link both tasks only to the Person.
- Make both tasks due exactly 48 hours after creation.
- Keep intake manual by default. Document the API contract so a website or an
  automation service can connect later with a role-scoped API key.
- Do not ship or assume an external automation platform or an app-owned webhook
  endpoint.
- Remove the packaged landing page and its navigation item.

## Current app inventory

Use `src/` as the source of truth. Keep `spec/app-features.md` synchronized with
the deployed model.

### Existing objects

- Company is a standard Twenty object. The app adds `clientStatus`, `industry`,
  `primaryContact`, `deals`, and `projects`.
- Industry is a custom object. Company `industry` is a nullable many-to-one
  relation to it, and Industry `companies` is the inverse relation.
- Person is a standard Twenty object. The app adds the inverse primary-contact
  and junction relations.
- Deal is a custom object. It has `stage`, `dealType`, `billingType`, `value`,
  `probability`, `leadSource`, `intakeSubmissionId`, Company and Person
  relations, and contact junctions.
- Project is a custom object. It has `billingType`, `status`, `value`,
  `annualizedValue`, dates, Company and Person relations, and contact junctions.
- `dealContact` and `projectContact` are junction objects. They give Deal and
  Project many contacts without creating an unsupported many-to-many relation.

### Existing views and navigation

- `src/views/deals-board.ts` defines a Deal kanban grouped by `stage`.
- `src/views/projects-list.ts` defines a Project table.
- Four packaged table views support operational work. The dashboard uses the
  Open Deals, Projects, and overdue follow-up views for record tables.
- Neither object view has a packaged navigation menu item. The maintainer adds
  both entries in the Twenty UI and chooses their positions and icons.
- `src/page-layouts/operational-dashboard.ts` defines the Operational dashboard
  layout. The app has no landing page or packaged navigation item.

### Confirmed field findings

- Company has `clientStatus` with Prospect, Client, and Former Client.
- Company has a nullable `industry` relation. The package defines no Industry
  records, so workspace-created industries remain record data across upgrades.
- Deal has lead attribution and a stage-derived probability.
- Deal `value` stores an estimated annual value.
- Project `value` stores a monthly amount for Recurring projects and a full
  contract amount for Singular projects. Project also has a status and a stored
  annualized value.

### Where work is verified

There is no local development environment and no `local` remote. Do not add one,
and do not ask the maintainer to start a server.

The verification target is the throwaway Twenty instance that CI already spawns
in `.github/workflows/ci.yml` through `spawn-twenty-app-dev-test`. CI pins the
server, the SDK packages, and the Twenty action source to the 2.37.0 release.
Each run gets a clean workspace. `appDevOnce` in
`src/__tests__/global-setup.ts` installs the app and generates the typed client.
The workspace is discarded when the run ends.

The setup prints the metadata plan and rejects every nonzero destructive-change
count. An approved retirement needs a separate reviewed migration path. Do not
weaken the default gate to make a plan apply.

The integration suite creates and updates Deal and Project records to exercise
their database-event handlers. It does not run the post-install dashboard hook,
because Twenty skips install hooks during development sync. The dashboard hook
has deterministic unit coverage, and the hosted dashboard has a separate manual
metadata verification workflow. A maintainer still verifies the rendered
worklists in the Twenty UI.

This replaces every `yarn twenty plan --remote local` gate in earlier drafts.
Where this plan says "the CI workspace" it means that instance.

- [x] Add a CI gate that fails the build when a sync reports a destroy.
  `appDevOnce`
  accepts `onPlan` and `confirmApply(deleteCount)`, so this gate is automatable
  rather than a human reading a diff.
- [ ] Give the migration runner and any rehearsal job the CI workspace
  credentials through `TWENTY_API_URL` and `TWENTY_API_KEY`, which the spawn
  action already exports.

CD in `.github/workflows/cd.yml` publishes only commits that reach `main`. It
does not deploy pull-request heads. The deployment action is pinned to the same
Twenty release commit used by CI. When Twenty's Auto-upgrade setting is enabled,
the installed app upgrades in the background.
The manual `.github/workflows/verify-operational-dashboard.yml` workflow reads
the fixed dashboard record without changing production data. It reads the
workspace URL from `TWENTY_DEPLOY_URL` and the deployment key from
`TWENTY_DEPLOY_API_KEY`.

If that record is absent, the manual
`.github/workflows/repair-operational-dashboard.yml` workflow resolves the
packaged page layout through the Metadata API, then touches only the fixed
Dashboard record through the Core API. It creates the record when absent or
repairs its title and layout link. It does not delete a Dashboard record.

### Verified SDK capabilities

Checked against the `twenty-sdk` and `twenty-client-sdk` 2.37.0 type declarations
in `node_modules` on 2026-09-08. Recheck after an SDK upgrade. An item marked
unverified fits the manifest but has never reached a server. Confirm each one
against the CI workspace before you build on it.

An attempted 2.39.0 upgrade passed lint, unit tests, and manifest build. It was
not accepted because the workspace-generated client and runtime integration
tests were not exercised against a 2.39.0 CI instance. A fresh-checkout
typecheck uses fallback declarations and cannot prove workspace-schema
compatibility. Rehearse the upgrade in a throwaway 2.39.0 CI workspace before
changing the pinned versions.

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
  standard objects in this app. CI has accepted the packaged Task
  `automationKey` field.
- `WidgetType.GRAPH` is the outer widget type for native charts. The nested
  configuration identifies `AGGREGATE_CHART`, `BAR_CHART`, `PIE_CHART`, or
  `LINE_CHART`. These configuration names are not `WidgetType` members.
  `PageLayoutType` includes `DASHBOARD`, and `PageLayoutTabLayoutMode` includes
  `GRID`.
- `ViewFilterOperand` includes `IS_RELATIVE`, `IS_IN_PAST`, `IS_EMPTY`, and
  `IS_NOT_EMPTY`, and `ViewFilterGroupLogicalOperator` includes `OR`, so
  relative-date and missing-value views are packageable.
- SELECT filters with `IS` or `IS_NOT` store their option keys in an array.
- A manifest renames serialized relation keys, so a `RECORD_TABLE` widget writes
  `viewUniversalIdentifier` where the runtime type says `viewId`. A record table
  also needs the widget-level `objectUniversalIdentifier`; without it, Twenty's
  renderer has no `objectMetadataId` and returns no table content.
- `ViewFieldManifest` accepts `aggregateOperation`, and `ViewManifest` accepts
  `filters`, `filterGroups`, `kanbanAggregateOperation`, and
  `kanbanAggregateOperationFieldMetadataUniversalIdentifier`. These view fields
  do not provide a packaged aggregate dashboard tile by themselves.

## What lives where

Two places hold configuration, and the split matters in every phase:

- **The repository** owns objects, fields, relations, views, page layouts, logic
  functions, roles, migration tooling, tests, and documentation. CD deploys it.
- **Workspace configuration** means settings created in the Twenty UI: sidebar
  entries, workflow steps, and API keys. These are
  not packaged app entities, so a reinstall does not restore them. Anything that
  lives only here must also be written down in `SETUP.md`.

The Person follow-up workflow is not configured. Its planned assignment rule
uses the workspace member who created the triggering Person, and its planned due
date is 48 hours after Task creation. The workflow stays inactive until it has a
named owner and tests. API-intake Task assignment remains deferred to the future
intake automation design.

## Phase 1: Make the documentation reliable

Give a first-time maintainer one clear setup path and one place to check
implementation rules.

Repository: Current repository.

### Tasks

- [x] Rewrite `SETUP.md` as a task-focused installation and operations guide.
- [x] Keep local setup, production deployment, and troubleshooting as distinct
  sections in `SETUP.md`.
- [x] Document the manual sidebar steps for the Deal and Project views.
- [x] Document the package version rule. Increase `package.json` by `0.0.1` in
  the same change as every deployable metadata or application change.
- [x] Document that this project has no local development environment. CI is the
  verification target and CD is the only path to a live workspace.
- [x] Remove the `--remote local` and `--remote production` command examples from
  `SETUP.md`. Neither remote resolves, and the names have pointed at the wrong
  targets before.
- [x] Document that a remote's name is not proof of its target. Any command that
  reaches a live workspace takes an explicit URL, and the operator confirms that
  URL before running it.
- [x] State that no maintainer or agent passes `--force` to `yarn twenty apply`.
- [x] Point `SETUP.md` and `README.md` at `AGENTS.md` instead of restating the
  implementation rules.
- [x] Keep `AGENTS.md` and `CLAUDE.md` identical. Edit both in the same commit.
- [x] Update `spec/app-features.md` after each model change.
- [x] Update `spec/objects-and-views.md` when an object, field, relation, value
  rule, or view changes.
- [x] Replace the placeholder product copy in `README.md` with a short
  description of the app and links to the setup guide, the specs, and this plan.
- [x] Update `CHANGELOG.md` with the changes already released after `0.1.1`.

`AGENTS.md` and `CLAUDE.md` are byte-identical, and they already carry entity
creation, remotes, UUIDs, navigation, testing, versioning, and deployment. A
third copy of those rules would drift from the other two, so this plan adds no
`spec/implementation-rules.md`.

### Acceptance criteria

- [x] A new maintainer can identify every manual Twenty UI step before running
  an apply command.
- [x] The documentation distinguishes packaged metadata from settings that live
  only in the Twenty UI.
- [x] The documentation uses the field names and commands that exist in the
  repository.
- [x] Documentation-only changes do not bump the package version.

### Verification

- [x] Compare object and field claims with `src/objects/` and `src/fields/`.
- [x] Compare view and navigation claims with `src/views/` and
  `src/navigation-menu-items/`.
- [x] Search the documentation for production-facing commands that name a remote
  or omit an explicit workspace URL.
- [x] Check every relative Markdown link from the repository root.

## Phase 2: Clean the app to a reviewed baseline

Remove what should never have shipped, then tag the result. Every later phase
builds on that commit.

### Tasks

- [x] Keep the current Company, Person, Deal, Project, `dealContact`, and
  `projectContact` structure. Leave the `internalNotes` metadata in place for
  now. Phase 3 removes it after the data migration is approved.
- [x] Remove the landing-page front component, page layout, and navigation item.
- [x] Remove credentials, hostnames, account IDs, owner IDs, form slugs, and
  source mappings from tracked files.
- [x] Keep every generated identifier a valid UUID v4.
- [x] Leave `src/fields/deal-stage.ts` alone, including its option values,
  labels, colors, positions, and `PIPELINE` default.
- [x] Leave the `src/views/deals-board.ts` kanban groups alone. Each group pins a
  stage value to its own universal identifier, so the board and the field stay
  in step only while both are left alone.
- [x] Keep the rule that object views do not create sidebar entries.
- [ ] Tag the reviewed baseline before Phase 3 starts.

### Acceptance criteria

- [x] `src/fields/deal-stage.ts` and the `src/views/deals-board.ts` groups are
  unchanged from before this phase.
- [x] Tracked files contain no secret-shaped strings or environment bindings.
- [x] The app creates no landing page and no landing-page navigation item.
- [ ] The package identity and the CD deployment configuration still work.

### Verification

- [x] Run `yarn typecheck`, `yarn lint`, and `yarn test:unit`.
- [x] Run a secret scan against tracked files.
- [ ] Run the branch through CI and review the resulting plan.
- [ ] Allow only the reviewed landing-page removals in the destroy list at this
  phase. Everything else must show a destroy count of zero.
- [ ] Let the maintainer deploy and perform the visual checks.

## Phase 3: Add fields and calculation rules

Add the smallest model changes needed for intake and native reporting.

Create each entity with `yarn twenty dev:add`. Do not handwrite generated IDs.

Source is tracked. The maintainer approved direct removal of the redundant
`internalNotes` fields in this development workspace, so Phase 3 has no
migration tooling, migration state, value export, or rollback set.

### Replace Company Industry select

The app-owned SELECT cannot safely accept workspace-added options because each
app sync sends the complete packaged option list. Replace it with a custom
Industry object and a Company relation so each Industry is workspace-owned
record data.

- [x] Add the Industry object with `name` as its label identifier.
- [x] Replace Company `industry` with a nullable MANY_TO_ONE relation.
- [x] Add the inverse Industry `companies` ONE_TO_MANY relation.
- [x] Use SET_NULL when an Industry is deleted.
- [x] Do not package or preload any Industry records.
- [x] Add an integration test that creates an Industry record, syncs the app a
  second time, and confirms that the record remains.
- [ ] Export and count existing Company Industry assignments before the first
  deployment of this replacement.
- [ ] Review the CI plan and approve the old SELECT field retirement before
  deployment.
- [ ] Restore the exported assignments through Industry records and verify the
  resulting count after deployment.

### Remove redundant `internalNotes` fields

Every object already has built-in Notes, so the Company, Person, Deal, and
Project `internalNotes` fields go away.

The maintainer approved direct removal. Do not build or run a migration runner,
preserve source values, or create rollback data. The built-in Notes relation
remains available on each object after the custom fields are removed.

- [x] Remove the Company, Person, Deal, and Project `internalNotes` fields.
- [x] Leave built-in Notes and their object relations unchanged.

### Add Project fields

- [x] Add `status` as a SELECT field.
- [x] Use Planned, Active, On Hold, Completed, and Cancelled as the options.
- [x] Add `annualizedValue` as a nullable CURRENCY field.
- [x] Treat `annualizedValue` as a derived field.
- [x] Do not edit `annualizedValue` manually.

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

- [x] Add `probability` as a nullable NUMBER field, displayed as a percentage,
  that stores the Deal's current stage value.
- [x] Add `leadSource` as a SELECT field.
- [x] Ship Website Form (`WEBSITE_FORM`), Manual (`MANUAL`), Business Card
  (`BUSINESS_CARD`), and Other (`OTHER`) as the initial Lead Source options.
- [ ] Allow workspace owners to add their own Lead Source options through
  Twenty's standard data-model settings.
- [x] Add `intakeSubmissionId` as a nullable TEXT field with `isUnique: true`.
- [ ] Keep `intakeSubmissionId` empty for manually created Deals.
- [ ] Do not add fields for a form slug, raw request, intake summary, or
  organization-specific intake context.
- [ ] Rehearse option preservation in CI. Add a Lead Source option through the
  metadata API, sync the app again, and assert that the option survives and that
  the plan does not remove it. Record the result here. The Lead Source
  extensibility promise in Phase 6 rests on this behavior, so prove it before the
  release depends on it.

Keep `probability` as a NUMBER, displayed as a percentage. A packaged logic function updates it when
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
- [x] Add `automationKey` as a nullable TEXT field with `isUnique: true`.
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
- [x] Trigger the Project function on `project.created` and on
  `project.updated` scoped to `updatedFields: ['billingType', 'value']`.
- [x] Trigger the Deal function on `deal.created` and on `deal.updated` scoped to
  `updatedFields: ['stage']`.
- [x] Keep the stage mapping in one exported constant that the function and its
  tests both import.
- [x] Stop with an actionable error on a stage that the mapping does not cover.
  Do not leave a stale probability and do not guess a value.
- [x] Return without writing when the computed value already equals the stored
  value.
- [x] Prefer the last write when a record changes while the function runs. Do not
  retry a calculation that a newer event supersedes.
- [x] Leave the derived field empty when a calculation fails. Never write a stale
  or partial value.
- [x] Move the CI typecheck step after the integration-test step.
- [x] Verify that CI typecheck uses a generated schema containing Project
  `annualizedValue` and Deal `probability`, not the fallback declarations.
- [x] Document each function, its trigger, and its failure modes in `SETUP.md`.

Writing a derived field raises the same object's update event again, so either
function can trigger itself. Two guards stop the loop. The `updatedFields`
filter is the first. The equality check above is the second.

### Restrict the application role

Define the packaged function before finalizing its role. Scope permissions to
the objects and fields it actually reads or updates.

- [x] Use `objectPermissions` and `fieldPermissions` in `RoleConfig`.
- [x] Grant read access to the Project source fields and to Deal `stage`.
- [x] Grant update access only to Project `annualizedValue` and Deal
  `probability` if Twenty accepts that field-level restriction.
- [x] Do not grant create, delete, destroy, restore, or soft-delete permissions.
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

- [ ] Each of the seven Deal stages sets its mapped probability, with Won stored
  as 1 and displayed as 100%, and Lost at 0.
- [ ] An unmapped stage reports an actionable error instead of leaving a stale
  probability.
- [ ] Project `annualizedValue` matches the formula in this plan, computed in
  `amountMicros`.
- [ ] A missing source value cannot produce a misleading zero.
- [ ] Existing live records retain their business values.
- [ ] The application role cannot delete records.
- [ ] The model change increments the package version by `0.0.1`.

### Verification

- [x] Add unit tests for Recurring, Singular, empty, zero, and decimal values.
  Assert on `amountMicros` integers, not on display amounts.
- [x] Add a unit test that asserts the probability for all seven stages and a
  stop for an unknown stage value.
- [ ] Have the maintainer move one Deal through two stages in the workspace and
  confirm that `probability` follows.
- [ ] Add a test that the calculation is idempotent. Running it twice on the same
  record produces one write, not a loop.
- [x] Keep the calculation itself in a pure function that the unit tests import
  without a server or a generated client.
- [x] Add integration tests that create and update Deal and Project records,
  then wait for their derived values.
- [ ] Confirm that the new runtime integration tests pass in the pinned Twenty
  2.37.0 CI workspace.
- [x] Skip migration-runner tests and rollback verification. The maintainer
  approved direct field removal with no migration work.
- [x] Run the integration tests before typecheck in CI so `appDevOnce` installs
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

- Risk: Moderate. The workflow writes Tasks in the hosted CRM.
- Owner: Unassigned.
- Status: Not configured or tested. Create it inactive.

Assign an owner and complete the workflow tests before activation. A human
reviews the inactive workflow and activates it after those checks pass.

The integration contract can be written now. The Person workflow uses the
workspace member who created the triggering Person and needs no timezone
configuration.

### Configure the Person follow-up workflow

Twenty saves manually entered People before all fields are filled. A workflow
that listens only for `person.created` can run before an email address or phone
number exists. Use `Record is Created or Updated`. Watch `emails` and `phones`.
The maintainer configures this workflow in the Twenty UI.

This one stays in the UI, unlike the Deal probability function. In the Create
Task action, set `assigneeId` from the triggering Person's
`createdBy.workspaceMemberId`. Do not use `updatedBy`, because a later editor
must not take ownership of the follow-up. Set the due date to the Task creation
time plus 48 hours. This duration does not need a business timezone.

If `createdBy.workspaceMemberId` is empty, do not assign a Task by guessing.
Stop the workflow for manual review. This protects automated and API-created
People, whose Task assignment policy is deferred to their intake automation.

- [x] Document the workflow setup in `SETUP.md`. Full workflows are workspace
  configuration and are not packaged app entities.
- [ ] Add one Code action that returns both Task keys and a due date 48 hours
  after Task creation.
- [ ] Add an email-task branch that runs when the Person has a primary email.
- [ ] Upsert the email Task by `automationKey` using
  `<person-id>:new-person-email`.
- [ ] Add a call-task branch that runs only when the Person has a primary phone
  number.
- [ ] Upsert the call Task by `automationKey` using
  `<person-id>:new-person-call`.
- [ ] Link each Task only to the Person that triggered the workflow.
- [ ] Assign both Tasks to the triggering Person's
  `createdBy.workspaceMemberId`.
- [ ] Stop for manual review when the triggering Person has no creator workspace
  member.
- [ ] Make each Task due exactly 48 hours after it is created.
- [ ] Do not send an email or place a call. The workflow creates Tasks only.

Both branches use stock record triggers, filters, Code, and Task upserts. The
Code action constructs `automationKey` and the 48-hour due date.

### Write the optional integration contract

- [x] Add `spec/intake-contract.md`.
- [x] Describe integration through Twenty's generated REST or GraphQL API.
- [x] Document how to create an API key and assign it a least-privilege role.
- [x] Do not prescribe an automation platform, a website payload, or an
  app-owned endpoint.
- [x] Define required, optional, nullable, and ignored values for a generic lead
  intake.
- [x] Require a stable `intakeSubmissionId` for every automated Deal intake.
- [x] Define Person, Company, Deal, contact-junction, and optional Note mappings.
- [x] Define every stop, retry, and manual-review outcome.
- [x] Leave Task assignment for API-created People to the intake automation that
  creates them. Do not prescribe it in this contract.

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
- [ ] Confirm that each Task is due exactly 48 hours after creation, including
  across weekends.

#### Field and integration checks

- [ ] Have the maintainer create two manual Deals with empty
  `intakeSubmissionId` values. Confirm that the uniqueness constraint permits
  normal manual use.
- [ ] Review the integration contract against REST and GraphQL API behavior.
- [ ] Test a sample integration outside this repository with valid, duplicate,
  malformed, ambiguous, and partial-failure fixtures before calling the contract
  proven.

## Phase 5: Package native Twenty reporting

The installed `twenty-sdk` 2.37.0 packages native charts by using
`WidgetType.GRAPH` as the widget type and a chart-specific nested
`configurationType`. Supported configurations include `AGGREGATE_CHART`,
`PIE_CHART`, `BAR_CHART`, and `LINE_CHART`.

Every dashboard widget must provide its object universal identifier. A record
table also provides a view universal identifier. During application sync,
Twenty resolves these values to `objectMetadataId` and `viewId`. The record
table renderer requires both resolved IDs. Omitting the object binding produces
a title-only card even when the saved view resolves correctly.

Use the dashboard editor capture in
`spec/example/dashboard-metadata-reference.md` as the presentation reference.
Use packaged object, field, and view universal identifiers in the manifest
instead of the capture's workspace runtime IDs.

### Build the operational dashboard

Define one `DASHBOARD` page layout with three `GRID` tabs and 14 widgets on the
12-column grid:

- Overview: Deals by Stage, Companies by Industry, Current Revenue, Projected
  Revenue, Open Deals, Project Data Gaps, and Revenue Trends.
- Pipeline: Pipeline Value by Stage, Deals by Stage and Billing Type, and Open
  Deals Worklist.
- Operations: Revenue by Billing Type, Projects by Status, Projects, and
  Overdue Follow-ups.

Use the captured 6 by 6 chart sizes, 3 by 2 metric sizes, and 12 by 6 table and
trend sizes. Use a record limit of 10 for every record table. Package the
existing app-owned views for the Open Deals, Projects, and overdue follow-up
tables instead of the editor-generated workspace views.

Open Deals excludes Pipeline, Won, and Lost. Projected Revenue excludes Won and
Lost but includes Pipeline. This difference is intentional: Pipeline is the
unqualified intake stage, so it is omitted from the active-deal count and
worklist while remaining part of total projected revenue.

Do not repeat a field as both primary and secondary grouping. The captured
Pipeline Value by Stage and Revenue by Billing Type widgets contained that
editor artifact. The packaged versions use one grouping each.

Twenty's built-in Dashboard module lists standard Dashboard records, not page
layouts by themselves. The app must create one Dashboard record that points to
the packaged layout. Do not add a separate page-layout navigation item as a
substitute.

- [x] Open Deals. A Deal view that excludes Pipeline, Won, and Lost, sorted by
  update date.
- [x] Active Projects. A Project view filtered to status Active, sorted by
  `annualizedValue` descending. Show the USD annualized value.
- [x] Overdue follow-ups. A Task view for incomplete Tasks whose due date is in
  the past.
- [x] Data quality. A Project view for records missing `status`, `billingType`,
  or `value`, using `IS_EMPTY` filters in an `OR` filter group.
- [x] Use `MetadataApiClient.getPageLayouts` to resolve the packaged layout's
  runtime ID, then create, restore, or repair one fixed Operational dashboard
  Dashboard record through `CoreApiClient`. The lookup includes soft-deleted
  records, so an upgrade restores the fixed record instead of trying to reuse
  its occupied primary key. The synchronous post-install hook runs on a fresh
  install and each app upgrade. The SDK has no `defineDashboard` entity. Do not
  use a page-layout navigation item, create a blank Dashboard layout, or
  identify the record by a display label alone.

The hook touches one fixed Dashboard record. It creates the record when absent,
restores it when soft-deleted, and repairs its title and layout link when they
change. It does not delete a Dashboard record. To stop future reconciliation,
deploy a version without the hook. The Dashboard record remains until a
maintainer removes it.

Twenty skips the post-install hook during `appDevOnce`, so CI cannot prove that
the Dashboard record appears after a production install. Unit tests cover the
hook's create, restore, repair, no-op, and error paths. The manual verification
workflow checks the deployed tabs, 14 widget contracts, resolved object
bindings, saved-view links, and Dashboard record. These checks do not prove
visible UI behavior. Hosted UI verification remains a maintainer step.

Then finish the Deals board:

- [x] Show `probability` on the Deals board.
- [x] Do not add a navigation menu item. The maintainer adds the sidebar entry by
  hand, as with every other object view.
- [x] Do not add a page-layout navigation menu item for the Operational
  dashboard. It belongs in Twenty's built-in Dashboard module.

### Acceptance criteria

- [ ] A fresh installation shows one Operational dashboard in Twenty's built-in
  Dashboard module, with the three packaged tabs and 14 widgets.
- [x] Every dashboard widget uses a value in the installed `WidgetType` enum.
- [x] Every dashboard widget carries an object universal identifier.
- [x] Every record table uses a packaged view and a `recordLimit` of 10.
- [x] Aggregate cards calculate totals from object fields rather than table
  footers or truncated worklists.
- [x] The Open Deals view excludes Pipeline, Won, and Lost Deals.
- [x] The Deals board displays the stage-derived `probability`.
- [x] The Project Data Gaps metric counts Projects missing fields needed for
  revenue reporting with one OR filter group.
- [x] The manifest does not use workspace runtime IDs from the editor capture.

### Verification

- [x] Add a CI gate that rejects any destructive metadata plan before views and page
  layout reach the hosted workspace.
- [x] Add unit coverage for SELECT filter value shapes, the three-tab layout,
  all 14 widget definitions, chart filters, table bindings, and the dashboard
  hook's create and repair behavior.
- [ ] Run the read-only verification workflow after deployment and confirm that
  all widget object IDs and table view IDs resolve.
- [ ] Let the maintainer inspect the applied dashboard and verify charts,
  metrics, filters, and worklists.
- [ ] Do not use browser automation, screenshots, or end-to-end UI tests.

## Phase 6: Deploy the app and build on it

Deploy the reviewed version to the hosted workspace and start using it. This
phase does not end, and that is the point. The feature list after this comes
from real use rather than from this plan.

### Prepare the release

- [x] Confirm that tracked files hold no credentials, hostnames, owner IDs, or
  form slugs.
- [ ] Add the Deal and Project sidebar entries by hand in the Twenty UI. Record
  their positions and icons in `SETUP.md`.
- [ ] Confirm that the Operational dashboard appears in Twenty's built-in
  Dashboard module. Do not add a separate sidebar entry for it.
- [x] Document which workflows the maintainer configures in the UI after a
  deploy.
- [x] Document how to add a Lead Source option and how an integration uses its
  API name.
- [ ] Tag the reviewed version.

### Run it and learn from it

- [x] Install the reviewed version into a clean CI workspace first.
- [ ] Confirm that Twenty auto-upgrades the hosted workspace after CD publishes
  a higher package version.
- [ ] Confirm that the deploy removes the old landing-page component, page
  layout, and navigation item shown in the reviewed metadata plan.
- [ ] Use the app for real work: real Deals, real Projects, real follow-up Tasks.
- [ ] Keep a dated list of friction and missing features in
  `spec/app-features.md`, and take the next release's scope from it.
- [x] Keep API keys, owner IDs, and workflow assignments out of tracked files.

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

Before API-intake Task automation:

- [ ] Decide the Task assignment policy for API-created People.

## Recorded decisions

Do not reopen these decisions without new evidence:

- One repository, one app. The framework fork and the downstream copy are
  cancelled. Keeping the app general is a constraint on what goes into it, not a
  reason to split it.
- A packaged logic function calculates Project `annualizedValue` with
  `databaseEventTriggerSettings` and `CoreApiClient`. A fresh install's fallback
  declarations are not a workspace-schema check. The integration setup generates
  the real client, so CI runs typecheck after that setup installs the app.
- Packaged views provide record-table filters. `RECORD_TABLE` widgets embed
  those views, while native `GRAPH` widgets provide metrics and charts. The
  repository owns the dashboard definition; do not rebuild it by hand in the
  Twenty UI.
- `spec/implementation-rules.md` is not needed. `AGENTS.md` already holds those
  rules.
- A derived CURRENCY field inherits `currencyCode` from its source.
- Deal `probability` stays a plain NUMBER that a packaged logic function fills
  from the stage mapping in source. Defer weighted pipeline calculations.
- Deal probability stores a ratio and displays it as a percentage. The stage mapping
  is Pipeline 0.1, Outreach 0.2, Appt Set 0.3, Appt Met 0.5, Quote 0.75, Won 1,
  and Lost 0. Recalibrate from measured win rates, not from opinion.
- No reported number comes from a table footer or a kanban column total.
  Headline figures use native `GRAPH` widgets with aggregate configurations.
- Deal stages stay exactly as `src/fields/deal-stage.ts` defines them. No phase
  renames, remaps, adds, or removes a stage, so no phase touches the packaged
  kanban groups that pin those values.
- Lead Source starts with Website Form, Manual, Business Card, and Other. More
  can be added through Twenty's data-model settings.
- Manual intake is the default. The app documents an API contract but ships no
  webhook or automation-platform implementation.
- Built-in Notes store free-form context. The app adds no intake-summary,
  form-slug, or raw-request field.
- A planned stock workflow creates the email and conditional call Tasks. The
  workflow is not configured or tested. Create it inactive, then assign an owner
  and pass the required tests before activation. Both Tasks link only to Person.
- The app has no landing page or landing-page navigation item.
- Start AI work as a separate project after the app is deployed and in active
  use.
