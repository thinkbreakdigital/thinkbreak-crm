import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '4b384dac-d74b-4c5e-bc09-e875704a5985',
  name: 'person',
  label: 'Person',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'd5070997-ad78-40d4-92e0-277c4f85e3a0',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetFieldMetadataUniversalIdentifier: 'd43f29de-bec7-40b0-9eb2-b48d1983f8da',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.CASCADE, joinColumnName: 'personId' },
});
