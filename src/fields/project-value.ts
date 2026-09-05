import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '7513009e-51dc-469b-990a-fd87c591a9ae',
  name: 'value',
  label: 'Value',
  description:
    "Meaning depends on billing type: for a recurring project, the monthly retainer amount billed; for a singular project, the total one-time contract amount. Dashboards summing this field across both billing types must annualize recurring rows (value × 12) first, since this app has no formula field to do it automatically.",
  type: FieldType.CURRENCY,
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
});
