import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '3dd3080b-ef78-4602-b69c-86f1d5781f88',
  name: 'billingType',
  label: 'Billing type',
  type: FieldType.SELECT,
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  options: [
    { value: 'RECURRING', label: 'Recurring', position: 0, color: 'green' },
    { value: 'SINGULAR', label: 'Singular', position: 1, color: 'blue' },
  ],
  defaultValue: "'RECURRING'",
});
