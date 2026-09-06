import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'c74f9e94-9ee7-48e8-b283-8da4702b47ba',
  name: 'industry',
  label: 'Industry',
  type: FieldType.SELECT,
  objectUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  description: 'The company\'s primary industry.',
  options: [
    { value: 'ADD_NEW', label: 'Add New', position: 0, color: 'gray' },
  ],
  isNullable: true,
});
