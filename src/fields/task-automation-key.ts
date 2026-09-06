import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '080c9c0e-2a96-4e07-9f2c-280ce53dab2d',
  name: 'automationKey',
  label: 'Automation key',
  description: 'Idempotency key for automated Tasks. Leave empty for manual Tasks.',
  type: FieldType.TEXT,
  objectUniversalIdentifier: '20202020-1ba1-48ba-bc83-ef7e5990ed10',
  isNullable: true,
  isUnique: true,
});
