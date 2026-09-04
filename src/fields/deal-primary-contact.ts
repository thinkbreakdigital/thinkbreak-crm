import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'dbdcb7d2-7924-403c-9b31-aa42dff50b2b',
  name: 'primaryContact',
  label: 'Primary contact',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetFieldMetadataUniversalIdentifier: '7cf65bf3-a939-4cb9-8c28-44470194c0c2',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.SET_NULL, joinColumnName: 'primaryContactId' },
});
