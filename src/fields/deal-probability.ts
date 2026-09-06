import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '28456522-dc92-42de-85c5-42313f24dd37',
  name: 'probability',
  label: 'Probability',
  description: 'Derived from the Deal stage.',
  type: FieldType.NUMBER,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  universalSettings: {
    type: 'percentage',
  },
  isNullable: true,
});
