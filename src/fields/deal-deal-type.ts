import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '2b715f77-649b-4212-96b8-adf66a2f98f0',
  name: 'dealType',
  label: 'Deal type',
  type: FieldType.SELECT,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  options: [
    { value: 'NEW_BUSINESS', label: 'New Business', position: 0, color: 'blue' },
    { value: 'EXPANSION', label: 'Expansion', position: 1, color: 'green' },
    { value: 'RENEWAL', label: 'Renewal', position: 2, color: 'orange' },
  ],
  defaultValue: "'NEW_BUSINESS'",
});
