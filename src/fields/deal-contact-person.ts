import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '3edf573b-b06d-4429-ba05-fd6f6925b6d3',
  name: 'person',
  label: 'Person',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '903cc99d-46d8-46aa-b776-a7c503846e07',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetFieldMetadataUniversalIdentifier: 'e7ac9a66-4ff1-431f-bded-7f9b625c7cfb',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.CASCADE, joinColumnName: 'personId' },
});
