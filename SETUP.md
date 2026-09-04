# Setup

Follow these steps to get your app running locally.

## Prerequisites

- Node.js 24.14.1, managed with nvm
- Yarn 4
- Docker (to run the local Twenty server)

## Steps

1. Select the project's Node version and enable Corepack:

   ```bash
   nvm use
   corepack enable
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the local Twenty server:

   ```bash
   yarn twenty docker:start
   ```

   Check the server status at any time with `yarn twenty docker:status`.

4. Start the development server and sync your app:

   ```bash
   yarn twenty dev
   ```

5. Open [http://localhost:2020](http://localhost:2020) and log in with the default development credentials: `tim@apple.dev` / `tim@apple.dev`.

## Verifying your setup

- `yarn lint` - Lint the project with oxlint
- `yarn typecheck` - Type-check the project
- `yarn test:unit` - Run unit tests
- `yarn test` - Run integration tests

## Deploy to production

The CD workflow deploys a package to the production Twenty server on each push to `main`. The installed app has auto-upgrade enabled, so Twenty applies each newer package version in the background.
GitHub Actions needs a `TWENTY_DEPLOY_API_KEY` repository secret with permission to deploy apps. Keep the key out of the repository.

Before the first CI deployment, create the app registration from this checkout:

```bash
yarn twenty apply --remote production
```

Before each package deployment, increase the version in `package.json`. Twenty rejects a package version that is already deployed.

Review future metadata changes before merging them:

```bash
yarn twenty plan --remote production
```

## Troubleshooting

See the [troubleshooting guide](https://docs.twenty.com/developers/extend/apps/getting-started/troubleshooting) or ask on [Discord](https://discord.gg/cx5n4Jzs57).
