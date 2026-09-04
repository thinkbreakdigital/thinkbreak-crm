# How to build the Deal and Project model

This guide builds the sales and delivery model for ThinkBreak CRM: a Deal object on a
kanban board, a Project object, and the contact links between them and Company.

Read the constraints at the end before you start. Several of them changed the design,
and two of them are bugs in twenty-sdk 2.37.0 that you cannot work around.

## Before you start

Scaffold every entity with the CLI. It generates the UUID v4 identifiers that the
manifest requires, and hand-written files omit them:

```bash
yarn twenty dev:add object
yarn twenty dev:add field
yarn twenty dev:add view
yarn twenty dev:add navigationMenuItem
```

The `twenty` CLI defaults to the `production` remote, which is the live CRM. Pass
`--remote local` on every command that reaches a server.

Do not start a dev server and do not test through the web UI. Verify with `yarn
typecheck`, `yarn lint`, `yarn twenty plan --remote local`, and the metadata API at
`http://localhost:2020/metadata`.

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
| `value` | CURRENCY | |
| `company` | RELATION | MANY_TO_ONE to `company` |
| `primaryContact` | RELATION | MANY_TO_ONE to `person` |
| `contacts` | RELATION | ONE_TO_MANY to `dealContact` |
| `internalNotes` | TEXT | |

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
| `value` | CURRENCY | |
| `startDate` | DATE | |
| `endDate` | DATE | Optional, so set `isNullable` |
| `billingType` | SELECT | Recurring, Singular |
| `internalNotes` | TEXT | |

A company can have many projects. The `company` field is MANY_TO_ONE, and its inverse
`projects` on Company is ONE_TO_MANY.

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

Define the inverse field on the other object for every relation. These relations add
five fields to Company and six to Person:

- Company gains `clientStatus`, `primaryContact`, `deals`, `projects`, `internalNotes`
- Person gains `primaryContactForDeals`, `primaryContactForProjects`,
  `primaryContactForCompanies`, `dealContacts`, `projectContacts`, `internalNotes`

`clientStatus` is a SELECT with Prospect, Client, and Former Client. A workflow sets it
to Client when a deal reaches Won.

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

## Verify

Run these in order. If one fails, fix it before you continue:

```bash
yarn typecheck
yarn lint
yarn test:unit
yarn twenty plan --remote local
```

Read the plan before applying. Confirm the destroy count is zero, then apply:

```bash
yarn twenty apply --remote local
```

Check the result against the server rather than trusting the plan:

```bash
curl -s -X POST http://localhost:2020/metadata \
  -H "Authorization: Bearer $LOCAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { objects(paging:{first:200}) { edges { node { nameSingular fieldsList { name label type } } } } }"}'
```

The local API key is in `~/.twenty/config.json` under `remotes.local.apiKey`.

Bump the version in `package.json` before any deployment. Twenty rejects a package
version that is already deployed, and CD fails with `version must be higher than the
currently deployed version`.

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
