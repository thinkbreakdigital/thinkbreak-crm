import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'f8f242d1-29ef-462a-8008-94616c05835a',
  name: 'primaryContact',
  label: 'Primary contact',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetFieldMetadataUniversalIdentifier: '3b0651c5-fb3b-4143-aeac-29dd08371b81',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.SET_NULL, joinColumnName: 'primaryContactId' },
});
