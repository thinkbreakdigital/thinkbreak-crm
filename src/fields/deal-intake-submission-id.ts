import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '1d17bca1-2c06-4d64-9a6e-d742713e6602',
  name: 'intakeSubmissionId',
  label: 'Intake submission ID',
  description: 'Idempotency key for automated Deal intake. Leave empty for manual Deals.',
  type: FieldType.TEXT,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  isNullable: true,
  isUnique: true,
});
