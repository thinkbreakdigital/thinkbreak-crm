import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'd62cb047-c4be-409c-9d0a-c9c9a59fac11',
  name: 'billingType',
  label: 'Billing type',
  type: FieldType.SELECT,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  options: [
    { value: 'RECURRING', label: 'Recurring', position: 0, color: 'green' },
    { value: 'SINGULAR', label: 'Singular', position: 1, color: 'blue' },
  ],
  defaultValue: "'RECURRING'",
});
