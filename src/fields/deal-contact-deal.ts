import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'faa2879a-4642-46a5-8737-8d29dabadd65',
  name: 'deal',
  label: 'Deal',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '903cc99d-46d8-46aa-b776-a7c503846e07',
  relationTargetObjectMetadataUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  relationTargetFieldMetadataUniversalIdentifier: '0c47a56c-e2b4-485f-b4ce-636dcd163f24',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.CASCADE, joinColumnName: 'dealId' },
});
