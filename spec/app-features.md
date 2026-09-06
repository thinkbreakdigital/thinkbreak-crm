# ThinkBreak CRM app features

Reference for what the `thinkbreak-crm` app package defines. Source of truth
is `src/`; this file describes it. For the Deal and Project design and the
junction pattern behind `dealContact` and `projectContact`, see
`spec/objects-and-views.md`.

## Application

`src/application-config.ts` defines the application:

- Display name: ThinkBreak CRM
- Description: ThinkBreak's personal organizational CRM, and a showcase of
  the Twenty platform for potential clients.

`src/default-role.ts` defines the app's default role. It can read Project
`billingType` and `value`, read Deal `stage`, and update Project
`annualizedValue` and Deal `probability`. It cannot create, delete, destroy,
restore, or soft-delete records.

## Objects

### Company (standard object)

`src/fields/company-*.ts` adds four fields to the standard Company object:

| Field | Type | Notes |
| --- | --- | --- |
| `clientStatus` | SELECT | Prospect, Client, Former Client |
| `primaryContact` | RELATION | Many-to-one to Person |
| `deals` | RELATION | One-to-many, inverse of Deal's `company` field |
| `projects` | RELATION | One-to-many, inverse of Project's `company` field |

### Person (standard object)

`src/fields/person-*.ts` adds five fields to the standard Person object:

| Field | Type | Notes |
| --- | --- | --- |
| `primaryContactForDeals` | RELATION | One-to-many, inverse of Deal's `primaryContact` field |
| `primaryContactForProjects` | RELATION | One-to-many, inverse of Project's `primaryContact` field |
| `primaryContactForCompanies` | RELATION | One-to-many, inverse of Company's `primaryContact` field |
| `dealContacts` | RELATION | One-to-many, inverse of `dealContact`'s `person` field |
| `projectContacts` | RELATION | One-to-many, inverse of `projectContact`'s `person` field |

### Deal (custom object)

`src/objects/deal.ts` defines the object. `src/fields/deal-*.ts` defines its
fields beyond `name`:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | TEXT | Label identifier |
| `stage` | SELECT | Pipeline, Outreach, Appt Set, Appt Met, Quote, Won, Lost |
| `dealType` | SELECT | New Business, Expansion, Renewal |
| `billingType` | SELECT | Recurring, Singular |
| `value` | CURRENCY | Labelled Est. Annual Value; always a normalized annual estimate, regardless of `billingType` |
| `probability` | NUMBER | Derived from `stage`: 10, 20, 30, 50, 75, 100, or 0 |
| `leadSource` | SELECT | Website Form, Manual, Business Card, Other |
| `intakeSubmissionId` | TEXT | Nullable, unique external idempotency key |
| `company` | RELATION | Many-to-one to Company |
| `primaryContact` | RELATION | Many-to-one to Person |
| `contacts` | RELATION | One-to-many to `dealContact`; renders as a Person picker |

### Project (custom object)

`src/objects/project.ts` defines the object. `src/fields/project-*.ts`
defines its fields beyond `name`:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | TEXT | Label identifier |
| `company` | RELATION | Many-to-one to Company |
| `primaryContact` | RELATION | Many-to-one to Person |
| `contacts` | RELATION | One-to-many to `projectContact`; renders as a Person picker |
| `value` | CURRENCY | Meaning depends on `billingType`: monthly retainer amount if Recurring, total one-time amount if Singular |
| `startDate` | DATE | |
| `endDate` | DATE | Nullable |
| `billingType` | SELECT | Recurring, Singular |
| `status` | SELECT | Planned, Active, On Hold, Completed, Cancelled |
| `annualizedValue` | CURRENCY | Derived from `billingType` and `value`; do not edit manually |

A won deal often becomes two Project records rather than one: a Singular project for
the one-time setup work, and a Recurring project for the ongoing retainer. Splitting
them this way keeps each project's `billingType` and `value` in the unit that matches
how it is actually billed, rather than mixing a one-time fee into a monthly figure or
vice versa. It also leaves room to spin up further Singular projects later for large
items that need to be billed outside the retainer, without disturbing the retainer
project's monthly `value`. See Value and dashboard reporting in
`spec/objects-and-views.md` for how this affects reporting.

### dealContact and projectContact (junction objects)

`src/objects/deal-contact.ts` and `src/objects/project-contact.ts` link a
Deal or a Project to more than one Person. Both objects set
`isUICreatable: false` and `isSearchable: false`.

| Object | Fields beyond `name` |
| --- | --- |
| `dealContact` | `deal` (many-to-one to Deal), `person` (many-to-one to Person) |
| `projectContact` | `project` (many-to-one to Project), `person` (many-to-one to Person) |

## Views

`src/views/deals-board.ts` defines Deals board, a kanban view on Deal grouped
by `stage`, with one column per stage in the same order as the field's
options. It displays the stage-derived `probability` field.

`src/views/projects-list.ts` defines Projects list, a table view on Project.

The package also defines four table views used by the operational dashboard:

- `Open Deals` excludes Won and Lost Deals and sorts by latest update.
- `Active Projects` filters to Active Projects, sorts by `annualizedValue`
  descending, and shows each record's USD annualized value.
- `Overdue follow-ups` shows incomplete Tasks with a due date in the past.
- `Project data quality` shows Projects missing `status`, `billingType`, or
  `value`.

`src/page-layouts/operational-dashboard.ts` defines a Dashboard page layout
with one grid tab. Its four `RECORD_TABLE` widgets each show at most 10 records
from one of the packaged worklist views. The dashboard intentionally has no
aggregate revenue or count metrics because the installed SDK does not support
packaged aggregate widgets.

`src/logic-functions/ensure-operational-dashboard.ts` runs after installation
and every app upgrade. It resolves this layout through Twenty's metadata API,
then creates or repairs one fixed Dashboard record that points to the layout.
That record appears in Twenty's built-in Dashboard module. The function does
not delete Dashboard records.

No view or page layout has a packaged navigation menu item. See CLAUDE.md's
Navigation menu items section: the maintainer adds each sidebar entry by hand
in the Twenty UI, and sets its position and icon there.

## Logic functions

`src/logic-functions/update-project-annualized-value*.ts` maintains Project
`annualizedValue` when a Project is created or its billing inputs change.
`src/logic-functions/update-deal-probability*.ts` maintains Deal `probability`
when a Deal is created or its stage changes. Both skip writes when the stored
value already matches the result.

## Not defined

The app package has no front component, navigation menu item, skill, agent, or
connection provider. It has no workflow that sets Company's `clientStatus` to
Client. The maintainer builds that workflow in the Twenty UI.
