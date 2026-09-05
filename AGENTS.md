## Base documentation

- Getting started:
  - https://docs.twenty.com/developers/extend/apps/getting-started/quick-start.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/concepts.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/project-structure.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/local-server.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/scaffolding.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/troubleshooting.md
- Config:
  - https://docs.twenty.com/developers/extend/apps/config/overview.md
  - https://docs.twenty.com/developers/extend/apps/config/application.md
  - https://docs.twenty.com/developers/extend/apps/config/roles.md
  - https://docs.twenty.com/developers/extend/apps/config/install-hooks.md
  - https://docs.twenty.com/developers/extend/apps/config/public-assets.md
- Data:
  - https://docs.twenty.com/developers/extend/apps/data/overview.md
  - https://docs.twenty.com/developers/extend/apps/data/objects.md
  - https://docs.twenty.com/developers/extend/apps/data/extending-objects.md
  - https://docs.twenty.com/developers/extend/apps/data/relations.md
- Logic:
  - https://docs.twenty.com/developers/extend/apps/logic/overview.md
  - https://docs.twenty.com/developers/extend/apps/logic/logic-functions.md
  - https://docs.twenty.com/developers/extend/apps/logic/skills-and-agents.md
  - https://docs.twenty.com/developers/extend/apps/logic/connections.md
- Layout:
  - https://docs.twenty.com/developers/extend/apps/layout/overview.md
  - https://docs.twenty.com/developers/extend/apps/layout/views.md
  - https://docs.twenty.com/developers/extend/apps/layout/navigation-menu-items.md
  - https://docs.twenty.com/developers/extend/apps/layout/page-layouts.md
  - https://docs.twenty.com/developers/extend/apps/layout/front-components.md
  - https://docs.twenty.com/developers/extend/apps/layout/command-menu-items.md
- Operations:
  - https://docs.twenty.com/developers/extend/apps/operations/overview.md
  - https://docs.twenty.com/developers/extend/apps/operations/cli.md
  - https://docs.twenty.com/developers/extend/apps/operations/testing.md
  - https://docs.twenty.com/developers/extend/apps/operations/publishing.md
- Rich app example: https://github.com/twentyhq/twenty/tree/main/packages/twenty-apps/examples/postcard

## UUID requirement

- All generated UUIDs must be valid UUID v4.

## Common Pitfalls

- A view needs a navigationMenuItem to show up on the left sidebar. See Navigation menu items below before adding one.
- Creating a front-end component that has a scroll instead of being responsive to its fixed widget height and width, unless it is specifically meant to be used in a canvas tab.

## Navigation menu items

Do not scaffold a navigation menu item for a new view. Create the object and the view, then stop. The maintainer adds the sidebar entry by hand in the Twenty UI, where they also set its position and icon.

## Best practice

It's highly recommended to create new app entities using `yarn twenty dev:add`. These are the options:

| Entity type          | Command                                  | Generated file                        |
| -------------------- | ---------------------------------------- | ------------------------------------- |
| Object               | `yarn twenty dev:add object`             | `src/objects/<name>.ts`               |
| Field                | `yarn twenty dev:add field`              | `src/fields/<name>.ts`                |
| Logic function       | `yarn twenty dev:add logicFunction`      | `src/logic-functions/<name>.ts`       |
| Front component      | `yarn twenty dev:add frontComponent`     | `src/front-components/<name>.tsx`     |
| Role                 | `yarn twenty dev:add role`               | `src/roles/<name>.ts`                 |
| Skill                | `yarn twenty dev:add skill`              | `src/skills/<name>.ts`                |
| Agent                | `yarn twenty dev:add agent`              | `src/agents/<name>.ts`                |
| View                 | `yarn twenty dev:add view`               | `src/views/<name>.ts`                 |
| Navigation menu item | `yarn twenty dev:add navigationMenuItem` | `src/navigation-menu-items/<name>.ts` |
| Page layout          | `yarn twenty dev:add pageLayout`         | `src/page-layouts/<name>.ts`          |
| Page layout tab      | `yarn twenty dev:add pageLayoutTab`      | `src/page-layout-tabs/<name>.ts`      |
| Command menu item    | `yarn twenty dev:add commandMenuItem`    | `src/command-menu-items/<name>.ts`    |
| View field           | `yarn twenty dev:add viewField`          | `src/view-fields/<name>.ts`           |
| Connection provider  | `yarn twenty dev:add connectionProvider` | `src/connection-providers/<name>.ts`  |

This helps automatically generate required IDs etc.

## Testing

Do not write Playwright, Cypress, or any other end-to-end or front-end test. Do not drive the Twenty web UI, and do not take screenshots of it. The maintainer does that testing personally.

There is no local development environment. Do not create one. Never start a dev server, and do not run `yarn twenty dev`, `yarn twenty docker:start`, or any other long-running server process.

Verify work headlessly instead:

- `yarn typecheck` and `yarn lint`, which cover `src/` and `scripts/`
- `yarn test:unit` for unit tests
- CI is the only workspace target. `.github/workflows/ci.yml` spawns a throwaway Twenty instance, `yarn test` installs the app into it through `appDevOnce`, and that step also generates the typed client. Read metadata diffs and destroy counts from the CI log.

A typecheck on a fresh clone passes vacuously for anything importing `CoreApiClient`, because the SDK ships fallback declarations typed as `any`. Only CI checks that code against a real schema.

## Remotes

No remotes are configured for this project, and none should be. The `twenty` CLI would otherwise take its target from `defaultRemote` in `~/.twenty/config.json`, which depends on the machine rather than the repository. A remote's name is also not proof of its target: this project has had a remote named `production` pointing at localhost while the live CRM sat behind a differently named one.

So never rely on a remote name. If a command must reach a workspace, pass the URL explicitly and confirm it first. Never run `yarn twenty apply` against a live workspace without being asked, and never pass `--force`.

Deployment targets belong in configuration, not in tracked files. CD reads the workspace URL from the `SERVER_URL` repository variable and the key from the `TWENTY_DEPLOY_API_KEY` secret. Do not hardcode a workspace hostname anywhere in this repository.

## Model spec

`spec/objects-and-views.md` documents the Deal and Project model, the junction pattern that gives them multiple contacts, and the SDK constraints and bugs found while building it. Read it before changing objects, fields, or views.

## Versioning

Bump the `version` in `package.json` by 0.0.1 whenever you make a material change. Do it in the same commit as the change, not as a separate follow-up.

A change is material when it alters what gets deployed:

- Any object, field, view, view field, or navigation menu item
- Any logic function, skill, agent, role, or connection provider
- Any front component or page layout
- Any dependency change that reaches the built package

A change is not material when it only touches documentation, comments, or tests. Those need no bump.

Twenty rejects a package version that is already deployed. Skipping the bump makes CD fail with `version must be higher than the currently deployed version`, and the deploy is lost even though CI passes.
