import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '9450370e-197c-4da5-ac27-04b069ad5b0d',
  name: 'primaryContact',
  label: 'Primary contact',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetFieldMetadataUniversalIdentifier: '95a9e9ef-5c06-4d24-bdba-06aeb1bbc13b',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.SET_NULL, joinColumnName: 'primaryContactId' },
});
