import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'd670e9e5-d937-40bd-ac7f-1f4f561b5a94',
  name: 'project',
  label: 'Project',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'd5070997-ad78-40d4-92e0-277c4f85e3a0',
  relationTargetObjectMetadataUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  relationTargetFieldMetadataUniversalIdentifier: '21f76e43-1312-4203-a182-ffe945f2ed7f',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.CASCADE, joinColumnName: 'projectId' },
});
