# Changelog

All notable changes to this application are documented in this file.

## 0.1.25

- Replace the placeholder Operational dashboard with the captured three-tab,
  14-widget layout.
- Package native aggregate, pie, bar, and line charts with their object and
  field bindings.
- Bind every dashboard record table to both its object and packaged view, and
  use readable grid dimensions.
- Exclude Pipeline Deals from the Open Deals metric and worklist.

## 0.1.21

- Replace the Company Industry select with a relation to a custom Industry
  object.
- Store industries as workspace records so app upgrades do not redefine the
  available values.

## 0.1.20

- Display Deal Probability as a percentage.

## 0.1.19

- Add a nullable Company Industry select field with the `Add New` option.

## 0.1.18

- Treat Twenty's `NOT_FOUND` Dashboard response as an absent record during repair.

## 0.1.17

- Repair the Operational dashboard through narrow metadata and record queries.

## 0.1.16

- Add a manual workflow that runs the packaged Operational dashboard repair hook.

## 0.1.15

- Replace the failed manual installation workflow with a read-only Operational
  dashboard verification workflow.

## 0.1.14

- Fix local typechecking for derived Deal and Project field updates.
- Verify that the generated CI schema allows both fields in update inputs.

## 0.1.13

- Add a native Dashboard-module record for the Operational dashboard.

## 0.1.12

- Add the packaged operational reporting dashboard and its four worklist views.
- Show Deal probability on the Deals board.

## 0.1.11

- Add the follow-up workflow instructions and intake API contract.

## 0.1.10

- Release the CI schema-check repair through the deployment pipeline.

## 0.1.9

- Add Project annualized-value and Deal probability logic functions.
- Restrict the application role to the source and derived fields the functions
  need.

## 0.1.8

- Remove the redundant custom `internalNotes` fields.

## 0.1.7

- Add Phase 3 Project, Deal, and Task fields.

## 0.1.6

- Remove the packaged landing page, layout, and navigation item.

## 0.1.5

- Label Deal value as Est. Annual Value.
- Document the units for Deal and Project values.
- Add the app feature reference and rename the model specification to
  `spec/objects-and-views.md`.

## 0.1.4

- Remove packaged sidebar entries for the Deal and Project views. The maintainer
  adds those entries in the Twenty UI.

## 0.1.3

- Add the Deal and Project objects, their views, their contact junction objects,
  and the related Company and Person fields.

## 0.1.2

- Release a package version update to confirm Twenty app auto-upgrade behavior.

## 0.1.1

- Configure production app deployment through GitHub Actions.

## 0.1.0

- Initial application scaffolded with [`create-twenty-app`](https://www.npmjs.com/package/create-twenty-app)
