import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'e00ad7cd-a0ae-47d3-87ca-79cc9f9f2a1d',
  name: 'status',
  label: 'Status',
  type: FieldType.SELECT,
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  options: [
    { value: 'PLANNED', label: 'Planned', position: 0, color: 'gray' },
    { value: 'ACTIVE', label: 'Active', position: 1, color: 'green' },
    { value: 'ON_HOLD', label: 'On Hold', position: 2, color: 'yellow' },
    { value: 'COMPLETED', label: 'Completed', position: 3, color: 'blue' },
    { value: 'CANCELLED', label: 'Cancelled', position: 4, color: 'red' },
  ],
  isNullable: true,
});
