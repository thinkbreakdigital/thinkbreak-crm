# ThinkBreak CRM

ThinkBreak CRM is ThinkBreak's preferred structure for managing relationships,
sales, and delivery work in [Twenty](https://twenty.com/). Companies and People
hold the relationships, Deals track potential revenue, and Projects track
contracted work.

This repository packages that structure as a Twenty app. The app owns the data
model, calculated fields, operational views, and dashboard configuration.
Version control keeps those decisions reviewable and deployable as one unit.

## What the app adds

The app extends Twenty with these records and relationships:

- **Company** remains the center of the relationship. The app adds client
  status, industry, primary contact, Deals, and Projects.
- **Person** remains Twenty's standard contact record. A Person can be the
  primary contact or one of several contacts on a Deal or Project.
- **Deal** is a custom sales record with ThinkBreak's stages, revenue fields,
  probability calculation, attribution, and Company and Person relationships.
- **Project** is a custom delivery record with status, billing type, dates,
  calculated annual value, and Company and Person relationships.
- **Industry** is a custom object rather than a fixed select field. Workspace
  owners can manage the records without an app release replacing them.

The app uses `dealContact` and `projectContact` junction objects because Twenty
does not support direct many-to-many relations. This lets one Person belong to
several Deals and Projects without duplicating the Person record.

## The Deal model

ThinkBreak uses a custom Deal object instead of renaming Twenty's Opportunity
object. A custom object keeps the stage model and its calculations under source
control.

Deals move through this fixed sequence:

`Pipeline -> Outreach -> Appt Set -> Appt Met -> Quote -> Won or Lost`

Each Deal also records:

- Deal type: New Business, Expansion, or Renewal
- Billing type: Recurring or Singular
- Est. Annual Value
- Probability, calculated from the current stage
- Weighted value, calculated from Est. Annual Value and Probability
- Lead source: Website Form, Manual, Business Card, or Other
- Company, primary contact, and additional contacts
- An optional unique intake submission ID for retry-safe integrations

Est. Annual Value always uses an annual basis. For recurring work, it stores the
estimated annual recurring revenue. For singular work, it stores the estimated
one-time amount.

## Calculated fields

The app stores calculated values on each record so Twenty views and dashboard
widgets can sort, filter, and sum them.

### Deal probability

Deal probability follows the current stage:

| Stage | Displayed probability | Stored ratio |
| --- | ---: | ---: |
| Pipeline | 10% | `0.1` |
| Outreach | 20% | `0.2` |
| Appt Set | 30% | `0.3` |
| Appt Met | 50% | `0.5` |
| Quote | 75% | `0.75` |
| Won | 100% | `1` |
| Lost | 0% | `0` |

The app recalculates Probability when it creates a Deal or the Deal stage
changes.

### Deal weighted value

Weighted value applies the probability ratio to Est. Annual Value:

```text
Weighted value = Est. Annual Value x Probability
```

A Deal worth $100,000 at 20% probability has a weighted value of $20,000. A
Deal worth $100,000 at 90% probability has a weighted value of $90,000.

The calculation preserves the source currency and rounds to the nearest currency
micro. The app recalculates the field when it creates a Deal or when Est. Annual
Value or Probability changes. A missing input leaves the field empty. A
probability outside the stored `0` through `1` range stops the calculation.

### Project annualized value

Project Value follows the billing type:

- A Recurring Project stores its monthly amount. Annualized value is
  `Value x 12`.
- A Singular Project stores its full one-time amount. Annualized value equals
  `Value`.

The calculation preserves the source currency. It runs when the app creates a
Project or when Value or Billing type changes.

A won Deal can become separate Singular and Recurring Projects. This keeps a
one-time setup fee separate from a monthly retainer while the dashboard still
reports both on the same annual basis.

## Operational Dashboard

The app packages an **Operational Dashboard** with three tabs and 14 widgets.
The dashboard uses native Twenty charts and record tables tied to app-owned
fields and views.

### Overview

The Overview tab answers the main sales and delivery questions:

- **Current Annual Revenue** sums `annualizedValue` for Active Projects.
- **Projected Unrealized Revenue** sums `weightedValue` for Deals that are not
  Won or Lost. Pipeline Deals remain part of this forecast.
- **Open Deals** counts Deals after Pipeline and before Won or Lost.
- **Project Data Gaps** counts Projects missing Status, Billing type, or Value.
- **Deals by Stage** shows Deal count by stage.
- **Companies by Industry** shows Company count by Industry.
- **Revenue Trends** shows cumulative annualized Project value by creation
  month.

### Pipeline

The Pipeline tab includes:

- Pipeline Value by Stage
- Deals by Stage and Billing Type
- Open Deals Worklist

### Operations

The Operations tab includes:

- Revenue by Billing Type for Active Projects
- Projects by Status
- Projects list
- Overdue Follow-ups

The app also creates or repairs the Twenty Dashboard record that points to the
packaged layout after installation and version upgrades.

## Packaged views

The app includes these working views:

- **Deals board** groups Deals by stage and displays Probability.
- **Open Deals** excludes Pipeline, Won, and Lost, then sorts by the latest
  update.
- **Projects list** shows Name, Status, Billing type, and Annualized value.
- **Active Projects** filters to Active Projects and sorts by Annualized value.
- **Project data quality** finds Projects missing revenue inputs.
- **Overdue follow-ups** finds incomplete Tasks with a past due date.

## Intentional boundaries

ThinkBreak CRM uses Twenty's standard Notes, Tasks, attachments, and timeline
instead of duplicating them in custom fields. The app does not include
workspace credentials, Company-specific intake mappings, or active external
automations.

The package does not add sidebar navigation items. The workspace owner adds the
Deal and Project views in Twenty and chooses their position and icon.

## Development and deployment

This project targets `twenty-sdk` 2.37.0 and uses Yarn 4. CI installs the app in
a temporary Twenty workspace, checks the metadata plan, runs integration tests,
generates the workspace client, and typechecks against that generated schema.

The repository has no local Twenty server or named remote. Production deployment
uses the private CD workflow and repository-managed deployment credentials. See
[SETUP.md](SETUP.md) for the operating procedure.

Run the local checks with:

```bash
yarn lint
yarn test:unit
yarn typecheck
yarn twenty dev:build
```

## Reference documentation

- [Current app features](spec/app-features.md)
- [Deal and Project model](spec/objects-and-views.md)
- [Implementation plan](spec/implementation-plan.md)
- [Setup and operations](SETUP.md)
- [Release history](CHANGELOG.md)
- [Contributor instructions](AGENTS.md)
