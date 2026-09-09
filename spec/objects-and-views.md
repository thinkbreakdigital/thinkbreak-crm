# Deal and Project model

This reference describes ThinkBreak CRM's sales and delivery model: a Deal object on a
kanban board, a Project object, and the contact links between them and Company.

Read the constraints at the end before you change the model. Several constraints shaped
the design, and two are bugs in twenty-sdk 2.37.0 that the app cannot work around.

## Before you change the model

Create each new app entity with the CLI. It generates the UUID v4 identifiers that the
manifest requires:

```bash
yarn twenty dev:add object
yarn twenty dev:add field
yarn twenty dev:add view
```

Do not create a navigation menu item for a new object view. The maintainer adds the
sidebar entry in the Twenty UI and chooses its position and icon.

This repository has no local Twenty development environment and no named remotes. Do
not start a dev server or test through the web UI. Run `yarn typecheck`, `yarn lint`,
and `yarn test:unit` locally. CI installs the app into a temporary workspace for the
integration tests. CD is the only path to the hosted workspace. For the full operating
procedure, see [SETUP.md](../SETUP.md) and [AGENTS.md](../AGENTS.md).

## Build Deal as a custom object, not a renamed Opportunity

Opportunity looks like the right starting point. It is not usable.

An app package can only add to a standard object. The SDK exports `defineField`, which
attaches a field to an object you do not own, and nothing that overrides one. There is
no `extendObject`. So an app cannot rename Opportunity to Deal, and it cannot replace
the five options on Opportunity's `stage` field.

Define `deal` as a custom object instead. The model then lives entirely in this repo
and deploys through CI, rather than being clicked into each server by hand.

Opportunity stays in the sidebar. To remove it, deactivate it in Settings, Data model.
An app package cannot do that for you.

### Deal fields

| Field | Type | Notes |
| --- | --- | --- |
| `name` | TEXT | Label identifier for the object |
| `stage` | SELECT | Pipeline, Outreach, Appt Set, Appt Met, Quote, Won, Lost |
| `dealType` | SELECT | New Business, Expansion, Renewal |
| `billingType` | SELECT | Recurring, Singular |
| `value` | CURRENCY | Labelled Est. Annual Value; see Value and dashboard reporting below |
| `probability` | NUMBER | Stored as a ratio and displayed as a percentage. Derived from `stage`; 0.1, 0.2, 0.3, 0.5, 0.75, 1, or 0 |
| `leadSource` | SELECT | Website Form, Manual, Business Card, Other |
| `intakeSubmissionId` | TEXT | Nullable, unique external idempotency key |
| `company` | RELATION | MANY_TO_ONE to `company` |
| `primaryContact` | RELATION | MANY_TO_ONE to `person` |
| `contacts` | RELATION | ONE_TO_MANY to `dealContact` |

Name the type field `dealType`, not `type`. The server reserves `type` and rejects it
with `INVALID_FIELD_INPUT`.

Every object also gets `noteTargets`, `taskTargets`, `attachments`, and
`timelineActivities` for free. Do not add your own.

### Project fields

| Field | Type | Notes |
| --- | --- | --- |
| `name` | TEXT | Label identifier for the object |
| `company` | RELATION | MANY_TO_ONE to `company`, labelled Client |
| `primaryContact` | RELATION | MANY_TO_ONE to `person` |
| `contacts` | RELATION | ONE_TO_MANY to `projectContact` |
| `value` | CURRENCY | See Value and dashboard reporting below |
| `startDate` | DATE | |
| `endDate` | DATE | Optional, so set `isNullable` |
| `billingType` | SELECT | Recurring, Singular |
| `status` | SELECT | Planned, Active, On Hold, Completed, Cancelled |
| `annualizedValue` | CURRENCY | Derived from `billingType` and `value`; do not edit manually |

A company can have many projects. The `company` field is MANY_TO_ONE, and its inverse
`projects` on Company is ONE_TO_MANY.

## Value and dashboard reporting

Deal and Project each have a `value` CURRENCY field and a `billingType` SELECT field
(Recurring, Singular), but the two objects' `value` fields hold different units. There
is no shared formula behind them, because `FieldMetadataType` in twenty-sdk 2.37.0 has
no formula or rollup option; every `value` field is a plain number someone types in.

- Deal's `value` is labelled Est. Annual Value. It always holds a rough, normalized
  annual estimate, whatever the deal's `billingType`: for a recurring deal, estimate
  the annualized recurring revenue; for a singular deal, estimate the one-time amount.
  A pipeline dashboard can sum this field directly, since every row is already in the
  same annual unit.
- Project's `value` keeps the plain Value label, and its unit depends on `billingType`:
  for a recurring project it is the monthly retainer amount actually billed, and for a
  singular project it is the total one-time contract amount. A dashboard that sums
  Project `value` across both billing types uses the derived `annualizedValue`
  field. For recurring Projects, it equals `value × 12`; for singular Projects,
  it equals `value`. The derived field preserves the source currency code.

A deal that is won often becomes two projects rather than one, so that each has the
`billingType` and `value` unit that matches how it is actually billed: a Singular
project for one-time setup work, and a Recurring project for the ongoing retainer.
This also leaves room to spin up further Singular projects later for large items that
should be billed outside the retainer, without disturbing the retainer project's
monthly `value`.

## Give a deal or a project several contacts with a junction object

Twenty has no many-to-many relation. `RelationType` holds `MANY_TO_ONE` and
`ONE_TO_MANY` and nothing else. `MORPH_RELATION` solves polymorphism, where one field
points at several object types, which is a different problem.

A direct ONE_TO_MANY from Project to Person does not work either. It would put each
person on exactly one project. A marketing director who is the contact on three
projects for one client would break it.

Model the link as its own object. A junction object holds two MANY_TO_ONE fields, one
to each side, and one row per pair:

| Junction | Points at | Points at |
| --- | --- | --- |
| `dealContact` | `deal` | `person` |
| `projectContact` | `project` | `person` |

This is what Twenty core does. `messageListMember` links `messageList` to `person`
with exactly this shape, and `noteTarget` and `taskTarget` are the same idea.

Set `junctionTargetFieldUniversalIdentifier` in the `universalSettings` of the
ONE_TO_MANY field. The UI then renders the field as a picker for the far side. Adding
a contact to a project selects a person instead of building a link row.

Set `isUICreatable: false` and `isSearchable: false` on both junction objects. Core
also sets `isSystem: true`, which is what hides `noteTarget` from Settings.
`ObjectManifest` does not expose `isSystem`, so the two junction objects stay visible
in Settings, Data model. Nothing else exposes them, because neither one gets a menu
item.

### Contacts on both sides

Company already has `people`. Add `primaryContact` to Company so one of them can be
marked primary. Deal and Project each carry their own `contacts` list and their own
`primaryContact`, so a project's contacts can differ from the full company roster.

Define the inverse field on the other object for every relation. The app adds five
fields to Company and five to Person:

- Company gains `clientStatus`, `industry`, `primaryContact`, `deals`, and `projects`
- Person gains `primaryContactForDeals`, `primaryContactForProjects`,
  `primaryContactForCompanies`, `dealContacts`, and `projectContacts`

`clientStatus` is a SELECT with Prospect, Client, and Former Client. A workflow sets it
to Client when a deal reaches Won.

`industry` is a nullable MANY_TO_ONE relation to the custom Industry object. The
inverse `companies` field is ONE_TO_MANY. Deleting an Industry sets the Company
relation to null and does not delete the Company.

Industry values are records, not SELECT metadata. The app defines the object and
relation but creates no Industry records. Workspace owners create the records they
need, and later app upgrades do not send a replacement list of values.

## Add the kanban board

Set `type: ViewType.KANBAN` and point
`mainGroupByFieldMetadataUniversalIdentifier` at the Deal `stage` field. Add one entry
to `groups` per stage option, with `fieldValue` matching the option's `value` and
`position` setting the column order.

There is no `kanbanFieldMetadataId`. `key: ViewKey.INDEX` is deprecated and the server
ignores it, so a manifest view is always an extra view alongside the auto-provisioned
one.

Name your view something other than `All <Plural>`. The server provisions an index view
under that name for every object, and reusing it gives you two identically named views.

Do not add a navigation menu item for the view. See Navigation menu items in
CLAUDE.md: the maintainer adds sidebar entries by hand.

## Package operational worklists

The package defines four table views for the operational dashboard. `Open
Deals` excludes Won and Lost Deals and sorts by the latest update. `Active
Projects` filters to Active Projects, sorts by `annualizedValue` descending,
and shows the annualized USD value. `Overdue follow-ups` filters incomplete
Tasks whose due date is in the past. `Project data quality` uses an OR group of
`IS_EMPTY` filters for `status`, `billingType`, and `value`.

`operational-dashboard.ts` packages these views in a Dashboard page layout with
one grid tab. Each `RECORD_TABLE` widget has a record limit of 10. The tables
are worklists, not aggregate reports. Do not present their truncated rows or
table footers as revenue or count metrics.

The current SDK cannot package aggregate chart widgets. Keep current revenue,
projected revenue, Deal counts, lead-source mix, billing-type revenue, and
kanban column totals out of the dashboard until a supported widget and CI
validation are available.

## Verification

Run the local static checks:

```bash
yarn typecheck
yarn lint
yarn test:unit
```

CI runs `yarn test` in a temporary workspace. Read the metadata plan and destroy count
from the CI log before you approve a deployable model change.

Increase `package.json` by `0.0.1` in the same commit as every deployable model change.
Documentation-only changes do not need a version increase. Twenty rejects a package
version that is not newer than the installed version.

## Known constraints in twenty-sdk 2.37.0

Standard objects take new fields and nothing else. `defineField` adds a field to
Company or Person. No export renames a standard object, changes its label, or edits the
options on one of its select fields.

`type` is a reserved field name. So is anything else the server rejects with
`INVALID_FIELD_INPUT`, which only appears at plan time.

A string `defaultValue` needs nested quotes. Write `"'PIPELINE'"`, not `'PIPELINE'`.
TypeScript accepts either and the build only warns.

Object menu items do not work. The manifest types their key as
`targetObjectUniversalIdentifier`, the server validator requires
`targetObjectMetadataUniversalIdentifier`, and the build ships the key you wrote with
no rename in between. Each side rejects the other's name. Version 2.38.0 has the same
mismatch, and `yarn twenty dev:add navigationMenuItem` generates the name the server
refuses.

Use `type: NavigationMenuItemType.VIEW` instead. A view menu item renders as
`View name · Object` with a compound icon. An object menu item would render the
object's plural label alone. That difference is the visible cost of the bug.

`ObjectManifest` has no `isSystem` and no `isActive`. An app cannot hide or deactivate
an object, including its own.
