import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '2a61fee5-e886-4351-a420-e5e271c7cd75',
  name: 'annualizedValue',
  label: 'Annualized value',
  description: 'Derived from billing type and value. Do not edit manually.',
  type: FieldType.CURRENCY,
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  isNullable: true,
});
