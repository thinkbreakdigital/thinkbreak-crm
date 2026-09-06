import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'da72ba67-88d6-480a-b33f-715bf1541182',
  name: 'leadSource',
  label: 'Lead source',
  type: FieldType.SELECT,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  options: [
    { value: 'WEBSITE_FORM', label: 'Website Form', position: 0, color: 'blue' },
    { value: 'MANUAL', label: 'Manual', position: 1, color: 'gray' },
    { value: 'BUSINESS_CARD', label: 'Business Card', position: 2, color: 'purple' },
    { value: 'OTHER', label: 'Other', position: 3, color: 'yellow' },
  ],
  isNullable: true,
});
