import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'd43f29de-bec7-40b0-9eb2-b48d1983f8da',
  name: 'projectContacts',
  label: 'Project contacts',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetObjectMetadataUniversalIdentifier: 'd5070997-ad78-40d4-92e0-277c4f85e3a0',
  relationTargetFieldMetadataUniversalIdentifier: '4b384dac-d74b-4c5e-bc09-e875704a5985',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
