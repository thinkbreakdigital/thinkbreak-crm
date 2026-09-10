# Deployed dashboard metadata reference

- Initial capture: 2026-09-08T20:48:09Z
- Source: read-only Twenty Core API and Metadata API queries
- Inspection run: https://github.com/thinkbreakdigital/thinkbreak-crm/actions/runs/34276906388
- Inspection commit: `df4921a`
- Scope: dashboard records, dashboard page layouts, tabs, widgets, linked views,
  filters, sorts, and the object and field identifiers used by those items
- Excluded: credentials, the workspace URL, CRM records, and unrelated object
  metadata

Runtime IDs identify records in the inspected workspace. Application manifests
must use universal identifiers instead of runtime IDs.

## Dashboard records

### Operational dashboard

- Dashboard runtime ID: `9fc9c362-a362-4079-814d-268fcd9436c7`
- Page-layout runtime ID: `c8dbead1-1888-4cd0-9ef5-60ddd2b533f8`
- Position: `0`
- Created and last updated: `2026-09-06T12:50:19.144Z`

### Dash Config 1

- Dashboard runtime ID: `d8b54b38-61ed-44ae-9eab-b221995e9422`
- Page-layout runtime ID: `846389e4-521a-4bf6-bb4f-7f128c567045`
- Position: `-1`
- Created: `2026-09-07T11:56:42.641Z`
- Last updated: `2026-09-07T11:56:42.467Z`

## Dash Config 1 page layout

- Layout name: `Dashboard Layout`
- Layout type: `DASHBOARD`
- Runtime ID: `846389e4-521a-4bf6-bb4f-7f128c567045`
- Universal identifier: `846389e4-521a-4bf6-bb4f-7f128c567045`
- Owning application runtime ID: `654c7a66-c34f-4d2e-b663-96438fcefbb4`
- Tab title: `Tab 1`
- Tab runtime ID and universal identifier:
  `71a04f8d-221b-4d9c-b8eb-3c488996156d`
- Tab position: `0`
- Tab layout mode: `GRID`

### Deals by Stage

- Widget runtime ID and universal identifier:
  `5a54f81a-56d7-4d92-afb3-297aa83dd3cb`
- Widget type: `GRAPH`
- Configuration type: `PIE_CHART`
- Object: `deal`
- Object runtime ID: `ab1ad96f-ebe0-4066-b82a-09fee90b71da`
- Object universal identifier: `cca977ba-ccd0-4734-892d-ae53118d9d34`
- Position: row `0`, column `0`, row span `6`, column span `6`
- Aggregate operation: `COUNT`
- Aggregate field: Deal `stage`
- Group-by field: Deal `stage`
- Deal `stage` runtime ID: `34177d75-a23a-4779-a386-6a0d3363bf83`
- Deal `stage` universal identifier:
  `bc9ce40a-1bd4-45cd-a391-b67dd59b3563`
- Order: `FIELD_POSITION_ASC`
- Date granularity: `DAY`
- Manual sort order: `null`
- Display data labels: `true`
- Display legend: `true`
- Show center metric: `true`
- Hide empty category: `false`
- Split multi-value fields: `true`
- Color: `auto`
- Number format: `null`
- Description: `null`
- Record filters: none
- Record-filter groups: none

The inspected Deal stage options were `PIPELINE`, `OUTREACH`, `APPT_SET`,
`APPT_MET`, `QUOTE`, `WON`, and `LOST`, in that order.

### Companies by Industry

- Widget runtime ID and universal identifier:
  `736319ae-c4fe-4eaf-b538-333e2ea978b3`
- Widget type: `GRAPH`
- Configuration type: `BAR_CHART`
- Object: `company`
- Object runtime ID: `a968025a-30f5-4e6a-a223-aece8f03f893`
- Object universal identifier: `20202020-b374-4779-a561-80086cb2e17f`
- Position: row `0`, column `6`, row span `6`, column span `6`
- Aggregate operation: `COUNT`
- Aggregate field: Company `name`
- Company `name` runtime ID: `e3ede21b-19c7-41a5-addd-1d0b09c94d54`
- Company `name` universal identifier:
  `20202020-4d99-4e2e-a84c-4a27837b1ece`
- Primary group-by field: Company `industry`
- Company `industry` runtime ID: `118693fe-e094-4fa0-83d2-3b5957ecd0b6`
- Company `industry` universal identifier:
  `6e2fde4a-eee5-4fb6-84fe-eaa5e1913398`
- Group-by subfield: `name`
- Primary-axis order: `VALUE_DESC`
- Primary-axis date granularity: `DAY`
- Primary-axis manual sort order: `null`
- Secondary group-by field: `null`
- Secondary-axis order: `null`
- Secondary-axis manual sort order: `null`
- Omit null values: `true`
- Axis-name display: `NONE`
- Display data labels: `true`
- Display legend: `true`
- Split multi-value fields: `true`
- Layout: `VERTICAL`
- Group mode: `null`
- Cumulative: `false`
- Color: `auto`
- Number format: `null`
- Range minimum and maximum: `null`
- Description: `null`
- Record filters: none
- Record-filter groups: none

## Operational dashboard page layout

- Layout runtime ID: `c8dbead1-1888-4cd0-9ef5-60ddd2b533f8`
- Layout universal identifier: `e6b870c6-4f89-4b4e-9d64-8b8c91a9202a`
- Owning application runtime ID: `af17d916-eb82-4db9-b0f8-d1946234703f`
- Tab title: `Overview`
- Tab runtime ID: `6dbaec82-9975-4294-a111-f5a4d1698807`
- Tab universal identifier: `b38f26fe-d6a2-4483-9f63-1f871569072e`
- Tab position: `0`
- Tab layout mode: `GRID`

All four widgets have type and configuration type `RECORD_TABLE`, a record
limit of `10`, a row span of `1`, and a column span of `1`.
Their widget-level object metadata IDs are `null`; each widget resolves its
object through the linked saved view.

### Open Deals

- Widget runtime ID: `0484ed19-c51e-4c03-88b1-85c12ac81156`
- Widget universal identifier: `1b145e2f-dd15-43e5-a8a0-c388f72a92c1`
- Position: row `0`, column `0`
- View runtime ID: `fc2818ab-2013-4498-a54c-1d62366bbbbe`
- View universal identifier: `48120c6b-2448-4d91-83b3-11adc82a43fa`
- View object: `deal`
- Filters: Deal `stage IS_NOT [WON]` and Deal `stage IS_NOT [LOST]`
- Sort: Deal `updatedAt DESC`

### Active Projects

- Widget runtime ID: `ae8a4632-4bf6-43af-9fd5-60ce6f5d2147`
- Widget universal identifier: `4e9cd6d2-c687-481e-970a-cdd01f48d574`
- Position: row `0`, column `1`
- View runtime ID: `86320c07-3d73-45b2-8f9c-baa45370087d`
- View universal identifier: `532b5e98-8ce9-46dd-9e78-53fe9f58e83b`
- View object: `project`
- Filter: Project `status IS [ACTIVE]`
- Sort: Project `annualizedValue DESC`

### Overdue follow-ups

- Widget runtime ID: `536cf927-a7ce-4a71-be65-e82d24333731`
- Widget universal identifier: `9362c0bf-5d94-441f-9bd0-2e0f2a8de7c4`
- Position: row `1`, column `0`
- View runtime ID: `099f24ae-45a2-43e7-b55f-0289ed9fc2f2`
- View universal identifier: `aea51fbe-767e-4dcd-97ad-964fa510a739`
- View object: `task`
- Filters: Task `status IS_NOT [DONE]` and Task `dueAt IS_IN_PAST`
- Sorts: none

### Data quality

- Widget runtime ID: `189408c4-233d-4c98-b9ac-0daac307d4e4`
- Widget universal identifier: `35b659a8-69a3-49c2-8b44-edf8e451eb5b`
- Position: row `1`, column `1`
- Linked view title: `Project data quality`
- View runtime ID: `e890d6f3-2c4e-4996-8918-5ce83281c4e4`
- View universal identifier: `eab1d547-2f91-4f8d-a555-3bf84d674dd9`
- View object: `project`
- Filter group: `OR`
- Filters: Project `status IS_EMPTY`, Project `billingType IS_EMPTY`, and Project
  `value IS_EMPTY`
- Sorts: none

## Referenced object and field identifiers

### Standard objects and fields

- Company object: `20202020-b374-4779-a561-80086cb2e17f`
- Company `name`: `20202020-4d99-4e2e-a84c-4a27837b1ece`
- Task object: `20202020-1ba1-48ba-bc83-ef7e5990ed10`
- Task `status`: `20202020-70bc-48f9-89c5-6aa730b151e0`
- Task `dueAt`: `20202020-fd99-40da-951b-4cb9a352fce3`

### App-owned objects and fields

- Deal object: `cca977ba-ccd0-4734-892d-ae53118d9d34`
- Deal `stage`: `bc9ce40a-1bd4-45cd-a391-b67dd59b3563`
- Deal `weightedValue`: `71c1f015-60de-4a63-bc54-5be3218da742`
- Company `industry`: `6e2fde4a-eee5-4fb6-84fe-eaa5e1913398`
- Project object: `c3ad642e-8d67-491c-99c2-deddbe39f173`
- Project `status`: `e00ad7cd-a0ae-47d3-87ca-79cc9f9f2a1d`
- Project `billingType`: `3dd3080b-ef78-4602-b69c-86f1d5781f88`
- Project `value`: `7513009e-51dc-469b-990a-fd87c591a9ae`
- Project `annualizedValue`: `2a61fee5-e886-4351-a420-e5e271c7cd75`

## Other dashboard layouts found

The workspace also contained these dashboard page layouts:

- `My First Dashboard`, runtime ID
  `216e7122-f6a6-4197-88e3-a7b9ab64d33b`, universal identifier
  `20202020-d001-4d01-8d01-da5ab0a00001`. It has eight sample widgets and no
  matching Dashboard record in the captured dashboard list.
- An empty `Dashboard Layout`, runtime ID and universal identifier
  `1bba0a80-be5e-4819-b14d-a18b67cb7be3`. It has one empty grid tab and no
  matching Dashboard record in the captured dashboard list.

## Confirmed implementation distinction

The inspected chart widgets use `GRAPH` as the widget type. Their configurations
use `PIE_CHART` and `BAR_CHART`. The pinned `twenty-sdk` 2.37.0 declarations
include this combination in `PageLayoutWidgetConfiguration`.

The current Operational dashboard uses valid saved-view links. Its `1` by `1`
widget dimensions differ from the `6` by `6` dimensions of both manually
configured graph widgets.

## Updated Dash Config 1 capture

- Captured: 2026-09-09
- Inspection run:
  https://github.com/thinkbreakdigital/thinkbreak-crm/actions/runs/34297402276
- Dashboard runtime ID: `d8b54b38-61ed-44ae-9eab-b221995e9422`
- Page-layout runtime ID and universal identifier:
  `846389e4-521a-4bf6-bb4f-7f128c567045`

The dashboard now has three active tabs. Position `2` is unused.

- `Overview`, position `0`, runtime ID and universal identifier
  `71a04f8d-221b-4d9c-b8eb-3c488996156d`
- `Pipeline`, position `1`, runtime ID and universal identifier
  `eb523666-6f86-4a0d-80a3-e39ee52640b3`
- `Operations`, position `3`, runtime ID and universal identifier
  `8c0b8837-c392-4c86-af02-e795ba71ab9c`

### Overview widgets

- `Deals by Stage`: pie chart, Deal count grouped by `stage`, `6` by `6`.
- `Current Revenue`: aggregate, sum of Project `annualizedValue`, filtered to
  `status IS [ACTIVE]`, `3` by `2`.
- `Companies by Industry`: bar chart, Company count grouped by Industry,
  `6` by `6`.
- `Open Deals`: aggregate, Deal count filtered with one
  `stage IS_NOT [PIPELINE, WON, LOST]` condition, `3` by `2`.
- `Project Data Gaps`: aggregate, Project count with an `OR` filter for empty
  `status`, empty `billingType`, or empty `value.amountMicros`, `3` by `2`.
- `Revenue Trends`: cumulative line chart, sum of Project `annualizedValue`
  grouped by Project `createdAt` month, `12` by `6`.
- `Projected Revenue`: aggregate, sum of Deal `weightedValue`, filtered with
  `stage IS_NOT [LOST, WON]`, `3` by `2`.

`Open Deals` excludes Pipeline deals. `Projected Revenue` does not. Preserve
that difference only if Pipeline deals belong in projected revenue.

### Pipeline widgets

- `Pipeline Value by Stage`: horizontal stacked bar chart, sum of Deal `value`,
  with both primary and secondary grouping set to Deal `stage`, `6` by `6`.
- `Deals by Stage and Billing Type`: vertical stacked bar chart, Deal count,
  primary grouping by `billingType`, and secondary grouping by `stage`, `6` by
  `6`.
- `Open Deals Worklist`: record table linked to the generated `Deals Table`
  view, record limit `10`, `12` by `6`.

The generated `Deals Table` view has runtime ID
`bb7de3c0-ce88-456d-bd45-d0337aa397b9` and universal identifier
`25a0452a-9797-427e-8f35-80260142d43c`. It filters Deal `stage` with
`IS_NOT [LOST, WON]`. It does not exclude Pipeline deals and has no sort.

`Pipeline Value by Stage` repeats `stage` as both groupings. A packaged version
should use `stage` only as its primary grouping unless the repeated series is
intentional.

### Operations widgets

- `Revenue by Billing Type`: vertical stacked bar chart, sum of Project
  `annualizedValue`, both groupings set to `billingType`, and a
  `status IS [ACTIVE]` filter, `6` by `6`.
- `Projects by Status`: pie chart, Project count grouped by `status`, `6` by
  `6`.
- `Projects`: record table linked to the generated `Projects Table` view, no
  record limit, `12` by `6`.
- `Overdue Follow-ups`: record table linked to the generated `Tasks Table`
  view, no record limit, `12` by `6`.

The dashboard editor created object-backed views for both record tables:

- `Projects Table` has runtime ID `461071ad-07c6-4829-b35a-4857219727d6` and
  universal identifier `f39e86d0-a89c-48ed-bcc5-90676e402f33`. It has no
  filters or sorts.
- `Tasks Table` has runtime ID `9c9504bb-4484-4233-aebc-1dfbc92ff38c` and
  universal identifier `bad65949-a8d5-434e-b65b-ac1fd1fee4ec`. It filters
  `dueAt IS_IN_PAST` and `assignee IS current workspace member`, then sorts
  `dueAt ASC`. It does not exclude `DONE` tasks.

The object-only dashboard editor did not expose the packaged
`Project data quality` view. That UI limit does not prevent an app manifest
from linking a record-table widget to a known view universal identifier. The
generated `Projects Table` is not a replacement for the filtered data-quality
view.

`Revenue by Billing Type` repeats `billingType` as both groupings. A packaged
version should use `billingType` only as its primary grouping unless the
repeated series is intentional.

## Annualized value diagnostic

- Diagnostic run:
  https://github.com/thinkbreakdigital/thinkbreak-crm/actions/runs/34298190785
- Project create function universal identifier:
  `0d404833-c72e-48cb-ad09-f03573d1bc13`
- Project update function universal identifier:
  `d15abb48-1fbe-4850-afa9-3480929b9112`
- Both functions are installed in `LIVE` mode.
- The create trigger is `project.created`.
- The update trigger is `project.updated` with `billingType` and `value` as
  its watched fields.
- Both functions were created on `2026-09-06T03:33:22.976Z` and last updated
  on `2026-09-08T20:29:05.857Z`.

The read-only audit found one Project. Its source `value` and `billingType`
were present, and its billing type was `RECURRING`. Its `annualizedValue`
composite existed, but both `amountMicros` and `currencyCode` were empty.

That Project was created on `2026-09-05T14:35:07.665Z`, before the functions
were installed. The app has no completed live-record backfill, so the create
trigger could not calculate this record. The Project has a later general
`updatedAt` timestamp, but that timestamp does not prove that either watched
field changed. The live update trigger therefore remains unverified.

The expected rule is:

- `RECURRING`: copy the currency and multiply `value.amountMicros` by `12`.
- `SINGULAR`: copy both currency values without changing the amount.
- Missing `billingType` or `value`: leave `annualizedValue` empty.

The same logic passes the CI integration test for create, recurring-value
update, and change to Singular. That test uses a temporary workspace, so it
does not prove delivery in the deployed workspace.

Production function logs were unavailable. The server reported that audit
logs require `CLICKHOUSE_URL`, and `logicFunctionLogs` is not exposed as a
query. A controlled edit to the Project `value` or `billingType`, followed by
a read-only check, is the smallest live trigger test. Existing Projects still
need a reviewed backfill after their source fields are confirmed.

## Related Twenty documentation

- Dashboard structure and widget types:
  https://docs.twenty.com/user-guide/dashboards/overview
- Dashboard chart settings:
  https://docs.twenty.com/user-guide/dashboards/capabilities/chart-settings
- App page layouts and the 12-column dashboard grid:
  https://docs.twenty.com/developers/extend/apps/layout/page-layouts
