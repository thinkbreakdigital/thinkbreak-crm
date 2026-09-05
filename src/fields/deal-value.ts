import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'dc9c7c49-f860-4a47-a7ba-8723067fda5a',
  name: 'value',
  label: 'Est. Annual Value',
  description:
    'Rough estimate of what the deal is worth on an annual basis, regardless of billing type. For a recurring deal, estimate the annualized recurring revenue; for a singular deal, estimate the one-time amount.',
  type: FieldType.CURRENCY,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
});
