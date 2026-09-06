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
`probability` before it runs the typecheck for the packaged logic functions.

## Production deployment

GitHub Actions deploys every push to `main` through
[`.github/workflows/cd.yml`](.github/workflows/cd.yml). Before the first deploy,
set these repository values in GitHub:

- `TWENTY_DEPLOY_URL` repository variable. Set it to the explicit URL of the hosted
  Twenty workspace.
- `TWENTY_DEPLOY_API_KEY` repository secret. Give the key permission to deploy
  this app.

The workflow passes both values to the Twenty deployment action. Do not put a
workspace hostname or API key in a tracked file.

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

These sidebar entries are intentionally not packaged. The maintainer controls
their placement and icons in the workspace.

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
destroy count in that workflow's log before you approve a metadata change.

For a CD failure, confirm that `TWENTY_DEPLOY_URL` is an explicit workspace URL and that
`TWENTY_DEPLOY_API_KEY` can deploy the app. If Twenty rejects the package version,
increase `package.json` only when the change is deployable.

For Twenty platform issues, use the [Twenty troubleshooting guide](https://docs.twenty.com/developers/extend/apps/getting-started/troubleshooting).
