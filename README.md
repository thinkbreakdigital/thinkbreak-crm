# ThinkBreak CRM

ThinkBreak CRM is ThinkBreak's preferred structure for managing relationships, sales, and delivery work in Twenty. Companies and People hold the relationships, Deals track potential revenue, and Projects track contracted work.

## What changes in your workspace
Added to companies: 
- Client Status
- Industry
-  Primary Contact (WIP)
- Listed Deals and Projects 

A Person can now be a contact on several Deals and
Projects.

The app adds Deal, Project, and Industry records. Industries are records rather
than a fixed list, so the workspace can add or rename them without an app
update overwriting them.

## Deals

Every Deal moves through the same stages, and each stage sets the Deal's
probability of closing:

| Stage | Probability |
| --- | ---: |
| Pipeline | 10% |
| Outreach | 20% |
| Appt Set | 30% |
| Appt Met | 50% |
| Quote | 75% |
| Won | 100% |
| Lost | 0% |

The app sets the probability whenever a Deal is created or changes stage, then
multiplies it by the Deal's estimated annual value to get a weighted value. A
$100,000 Deal at the Quote Stage has a weighted value of $75,000.


## Projects

When a Deal is won, create one or more Projects for the work. Each Project has a
status, a billing type, start and end dates, and a value.

A recurring Project stores its monthly amount, and a one-time Project stores its
full amount. The app converts both to an annual value. A Deal with a $2,000
setup fee and a $1,000 monthly retainer becomes two Projects, which the
dashboard reports as $14,000 a year.

## Operational Dashboard

The app includes a dashboard with three tabs.

Overview shows annual revenue from active Projects and the weighted value of
every Deal not yet won or lost. It also counts open Deals, which are past
Pipeline and not yet closed, and Projects missing a status, billing type, or
value. Charts show Deals by stage, Companies by industry, and cumulative Project
revenue by month.

Pipeline shows Deal value by stage, Deal counts by stage and billing type, and a
worklist of open Deals.

Operations shows revenue by billing type, Projects by status, a full Projects
list, and follow-up tasks that are past due.

## Ready-made views

- Deals board, grouped by stage
- Open Deals, sorted by last update
- Projects list
- Active Projects, sorted by value
- Project data quality, for Projects missing revenue details
- Overdue follow-ups, for incomplete tasks past their due date

## What the app does not do

The app uses Twenty's standard notes, tasks, files, and timeline. It does not
connect to outside services or add sidebar items. After installing the app, we recommend adding a Kanban Deals view and adding the Projects object to the sidebar.
