# ThinkBreak CRM

ThinkBreak CRM is a Twenty app for managing sales Deals, delivery Projects, and
their Company and Person relationships. It packages the model and views that the
maintainer deploys to one hosted Twenty workspace.

Start with [SETUP.md](SETUP.md) for checkout, deployment, and workspace-only
configuration. [AGENTS.md](AGENTS.md) defines the rules for changing the app.

The repository specifications are:

- [Implementation plan](spec/implementation-plan.md)
- [Current app features](spec/app-features.md)
- [Deal and Project model](spec/objects-and-views.md)

Published releases are listed in [CHANGELOG.md](CHANGELOG.md). The optional
[Publish workflow](.github/workflows/publish.yml) publishes the package to npm
with provenance when a release tag triggers it.
