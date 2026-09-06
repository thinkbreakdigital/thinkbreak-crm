# Intake API contract

This contract defines the CRM boundary for an optional lead-intake automation.
It does not define a webhook, website payload, automation platform, or endpoint.
The integration project owns those choices, its credentials, and its activation.

## Scope

Use Twenty's generated REST or GraphQL API. Create a dedicated API key and give
it a separate least-privilege role. Grant the role only the read, create, and
update permissions that it needs for Person, Company, Deal, `dealContact`, and
optional Note fields. Do not grant delete, destroy, restore, or soft-delete
permission. Do not reuse the application's derived-value role.

Keep the integration inactive until its mappings, error paths, and credentials
receive human review. Lead intake contains personal data and writes CRM records,
so it is a high-risk automation. A human approves activation.

## Input values

Validate the payload before any CRM query or write. The integration defines its
transport shape, then maps it to these logical values.

| Value | Rule | CRM destination |
| --- | --- | --- |
| `intakeSubmissionId` | Required. Non-empty and stable across retries. | Deal `intakeSubmissionId` |
| Person name | Required. | Person `name` |
| Person primary email | Required for automatic Person matching. | Person `emails.primaryEmail` |
| Person primary phone | Optional. | Person `phones.primaryPhoneNumber` |
| Company domain | Optional. | Company `domainName` |
| Company name | Optional. | Company `name` |
| Deal name | Required. | Deal `name` |
| Lead source | Optional. It must equal an installed option value. | Deal `leadSource` |
| Deal type, billing type, value | Optional. Validate each value before writing. | The matching Deal field |
| Free-form context | Optional. | A built-in Note linked to the Deal |

Treat omitted or null optional values as no change. Ignore raw request IP
addresses, user-agent strings, full request bodies, and secrets. Do not
overwrite a populated CRM value with an empty external value. Reject a missing
required value and stop before creating a partial record.

## Write sequence

Perform writes in this order:

1. Validate the payload and `intakeSubmissionId`.
2. Find or create the Person by the primary email.
3. If the payload contains a Company domain, find or create the Company by that
   domain.
4. If the payload has no Company domain but has a Company name, search for an
   exact normalized Company name.
5. If more than one Company matches, stop for manual review.
6. Find or create the Deal by `intakeSubmissionId`.
7. Set the Deal's Company and primary Person when the matching records exist.
8. Find or create the `dealContact` relation for the Deal and Person pair.
9. Create a built-in Note only when free-form context is useful and has not
   already been recorded for this submission.

When a new Deal uses the packaged default stage, omit `stage` from the create
input. The app supplies `PIPELINE` as the default.

## Retry and manual-review rules

Use the same `intakeSubmissionId` for every retry of one external submission.
Before a retry writes, query the unique keys again. Write only a missing record,
relation, or Note.

| Condition | Action |
| --- | --- |
| Missing or malformed `intakeSubmissionId` | Stop and report a validation error. |
| Missing required Person name, Person email, or Deal name | Stop and report a validation error. |
| Ambiguous Company name match | Stop for manual review. |
| Lead source does not match an installed option | Stop for manual review. |
| Rate limit or transient server error | Retry a limited number of times. |
| Permanent API error | Stop and report the API response. |
| Retry after a partial write | Re-read the unique keys and create only missing work. |

Do not store ignored values in the CRM unless the workspace owner approves a
documented use.

## Task assignment

This contract does not create or assign follow-up Tasks for API-created People.
The intake automation that creates those People must define that assignment
policy before it writes Tasks. Do not infer an assignee from a missing or
automated `createdBy.workspaceMemberId` value.

No live intake integration is configured or verified by this repository.
