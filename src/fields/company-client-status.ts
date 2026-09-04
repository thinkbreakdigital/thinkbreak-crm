import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '47e5b3bf-687a-48a0-ad23-09aad4f4a0c8',
  name: 'clientStatus',
  label: 'Client status',
  type: FieldType.SELECT,
  objectUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  options: [
    { value: 'PROSPECT', label: 'Prospect', position: 0, color: 'gray' },
    { value: 'CLIENT', label: 'Client', position: 1, color: 'green' },
    { value: 'FORMER_CLIENT', label: 'Former Client', position: 2, color: 'red' },
  ],
  defaultValue: "'PROSPECT'",
});
