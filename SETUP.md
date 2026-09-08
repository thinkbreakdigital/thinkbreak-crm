# Setup and operations

Use this guide to prepare a checkout, understand the deployment path, and
complete the workspace configuration that the app package does not own. Read
[AGENTS.md](AGENTS.md) before you change the app. It defines the repository's
implementation, testing, remote, and versioning rules.

## Local checkout

This repository has no local Twenty development environment. Do not start a
Twenty server, run `yarn twenty dev`, or create a named Twenty remote. CI creates
a temporary Twenty workspace for integration testing. CD is the only path that
updates the live workspace.

Install the tools needed for static checks:

1. Select the Node version from `.nvmrc` and enable Corepack.

   ```bash
   nvm use
   corepack enable
   ```

2. Install the locked dependencies.

   ```bash
   yarn install --immutable
   ```

3. Run the local static checks.

   ```bash
   yarn lint
   yarn typecheck
   yarn test:unit
   ```

Run `yarn test` in CI. Its integration setup installs the app into a temporary
Twenty workspace and generates the workspace-specific client. CI then confirms
that the generated schema contains Project `annualizedValue` and Deal
`probability` before it runs the typecheck for the packaged logic functions. It
also creates an Industry record, syncs the app again, and confirms that the
record survives. CI pins the Twenty server, SDK packages, and action source to
2.37.0. The setup prints the metadata plan and refuses to apply any plan with a
nonzero destructive-change count.

## Production deployment

GitHub Actions deploys each commit that reaches `main` through
[`.github/workflows/cd.yml`](.github/workflows/cd.yml). It does not deploy a
pull-request head when someone adds a label. Before the first deploy, set these
repository values in GitHub:

- `TWENTY_DEPLOY_URL` repository variable. Set it to the explicit URL of the hosted
  Twenty workspace.
- `TWENTY_DEPLOY_API_KEY` repository secret. Give the key permission to deploy
  this app.

The workflow passes both values to the Twenty deployment action. Do not put a
workspace hostname or API key in a tracked file.

This repository uses private internal deployment. Marketplace and npm
publishing are not configured. `.github/workflows/publish.yml` records that
decision and performs no publish action.

When the app's Twenty Auto-upgrade setting is enabled, a successful CD publish
upgrades the installed app in the background. To confirm that the Operational
dashboard record exists, run the manual **Verify operational dashboard**
workflow in GitHub Actions. It performs a read-only query and does not run on
pushes.

If the verification workflow reports that the record is absent, run the manual
**Repair operational dashboard** workflow. It resolves the packaged dashboard
layout and creates or repairs only the fixed Operational dashboard record.

Before you merge a deployable change, increase `package.json` by `0.0.1` in the
same commit. Metadata, logic, roles, front components, page layouts, and shipped
dependency changes are deployable. Documentation, comments, and tests are not.
Twenty rejects a version that is not newer than the installed version.

Do not use a remote name to identify a workspace. A remote can point anywhere.
If a future maintenance command must reach a workspace, pass its explicit URL and
confirm that URL before the command runs. Never pass `--force` to
`yarn twenty apply`.

After CD deploys the app, complete these workspace-only steps in the Twenty UI:

1. Add a sidebar entry for the **Deals board** view on Deal.
2. Choose its sidebar position and icon.
3. Add a sidebar entry for the **Projects list** view on Project.
4. Choose its sidebar position and icon.
5. Create the Industry records needed by this workspace. The package does not
   preload any industries.

These sidebar entries are intentionally not packaged. The maintainer controls
their placement and icons in the workspace.

Company **Industry** is a relation to those Industry records. Add a sidebar entry
for Industries only if workspace administrators want a dedicated list for managing
them. The package intentionally does not choose that sidebar placement.

### Company Industry migration gate

Version 0.1.21 replaces the app-owned Company Industry SELECT field with a
relation. Applying this upgrade retires the old field and can remove any values
still stored in it. Before the first 0.1.21 deployment:

1. Export every Company ID, Company name, and current Industry value.
2. Count the exported Companies with a non-empty Industry and spot-check the
   export against the workspace.
3. Keep the export as the restore source.
4. Review the CI metadata plan and confirm that the old Industry SELECT is the
   only additional field retirement.
5. Deploy 0.1.21 only after the export and plan are approved.
6. Create one Industry record for each distinct exported value, then assign the
   matching record to each Company.
7. Compare the restored non-empty count with the export and spot-check the same
   Companies again.

For a new installation, skip this migration gate and create Industry records
after installation. Later upgrades preserve them because the app package defines
the Industry schema but does not define its records.

Do not add a separate sidebar entry for the Operational dashboard. It belongs
in Twenty's built-in Dashboard module. The package creates its Dashboard record
after installation and on each app upgrade. Do not change that record's title
or layout manually because the next upgrade restores the packaged configuration.

## Lead Source options for API intake

To add a Lead Source option, edit the Deal `leadSource` field in Twenty's
standard data-model settings. Give the option a label, then record its API name.
The API name is the option's stored `value`, not its display label.

An integration writes the API name to Deal `leadSource`. The packaged option
names are `WEBSITE_FORM`, `MANUAL`, `BUSINESS_CARD`, and `OTHER`. Before an
integration writes a new value, an administrator adds the matching option in
the workspace. If the option does not exist, the integration stops for manual
review.

The app package does not yet prove that a workspace-added option and records
that use it survive a redeploy. Treat that preservation check as a release
blocker before an integration depends on a workspace-added value. See
[spec/intake-contract.md](spec/intake-contract.md) for the intake boundary.

## Person follow-up workflow

The workflow is not configured or tested. It will write Tasks in the hosted CRM,
so its risk tier is Moderate. Assign a named owner and complete the tests in
Phase 4 of `spec/implementation-plan.md` before activation.

Configure the workflow in the Twenty UI. Do not add it to the app package.

1. After assigning an owner, create an inactive workflow on Person for records that are created or
   updated. Watch `emails` and `phones`.
2. Add a Code action that returns the email and call `automationKey` values and
   a due date 48 hours after the Task creation time.
3. Add an email branch that runs only when `emails.primaryEmail` is present.
   Upsert a Task using `<person-id>:new-person-email` as `automationKey`.
4. Add a call branch that runs only when `phones.primaryPhoneNumber` is present.
   Upsert a Task using `<person-id>:new-person-call` as `automationKey`.
5. Link each Task only to the Person that triggered the workflow.
6. Set each Task `assigneeId` to the triggering Person's
   `createdBy.workspaceMemberId`. Do not use `updatedBy`.
7. If `createdBy.workspaceMemberId` is empty, stop for manual review. Do not
   create an unassigned Task or guess an assignee.
8. Keep the workflow inactive until its branches, retry behavior, and required
   tests receive human review. A human activates the workflow.

This workflow creates Tasks only. It does not send email or place calls. API
intake automation owns its own Task-assignment policy.

## Derived values

The app packages two derived-value handlers, each registered for create and
relevant update events:

- Project `annualizedValue` runs on `project.created` and when `billingType` or
  `value` changes. It multiplies a recurring monthly amount by 12, keeps a
  singular amount unchanged, and preserves the source currency code.
- Deal `probability` runs on `deal.created` and when `stage` changes. It maps
  Pipeline, Outreach, Appt Set, Appt Met, Quote, Won, and Lost to 10, 20, 30,
  50, 75, 100, and 0.

Both handlers read the current record before writing. They do not write when
the stored value already matches the calculated value. An unmapped Deal stage
stops with an error instead of writing a guessed percentage. Missing Project
inputs clear `annualizedValue` rather than writing zero.

The application role can read the source fields and update only the derived
fields. It cannot create, delete, destroy, restore, or soft-delete records.

## Troubleshooting

For a CI failure, start with the failing workflow step. The CI workflow runs lint,
unit tests, and integration tests against a temporary workspace, then verifies
the generated client and typechecks it. Read the app-sync metadata plan and
destroy count in that workflow's log. CI rejects every nonzero destructive-change
count before applying the plan.

For a CD failure, confirm that `TWENTY_DEPLOY_URL` is an explicit workspace URL and that
`TWENTY_DEPLOY_API_KEY` can deploy the app. If Twenty rejects the package version,
increase `package.json` only when the change is deployable.

For a dashboard verification failure, open the **Verify operational dashboard**
workflow. Confirm that its target values are configured and that the app's
Auto-upgrade setting is enabled. The workflow does not change production data.

For a dashboard repair failure, read the **Repair operational dashboard**
workflow log. It reports the failing API operation and does not delete records.

For Twenty platform issues, use the [Twenty troubleshooting guide](https://docs.twenty.com/developers/extend/apps/getting-started/troubleshooting).
