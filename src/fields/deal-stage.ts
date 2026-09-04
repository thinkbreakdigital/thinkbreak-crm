import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'bc9ce40a-1bd4-45cd-a391-b67dd59b3563',
  name: 'stage',
  label: 'Stage',
  type: FieldType.SELECT,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  options: [
    { value: 'PIPELINE', label: 'Pipeline', position: 0, color: 'gray' },
    { value: 'OUTREACH', label: 'Outreach', position: 1, color: 'sky' },
    { value: 'APPT_SET', label: 'Appt Set', position: 2, color: 'blue' },
    { value: 'APPT_MET', label: 'Appt Met', position: 3, color: 'purple' },
    { value: 'QUOTE', label: 'Quote', position: 4, color: 'yellow' },
    { value: 'WON', label: 'Won', position: 5, color: 'green' },
    { value: 'LOST', label: 'Lost', position: 6, color: 'red' },
  ],
  defaultValue: "'PIPELINE'",
});
