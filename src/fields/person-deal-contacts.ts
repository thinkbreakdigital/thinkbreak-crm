import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'e7ac9a66-4ff1-431f-bded-7f9b625c7cfb',
  name: 'dealContacts',
  label: 'Deal contacts',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetObjectMetadataUniversalIdentifier: '903cc99d-46d8-46aa-b776-a7c503846e07',
  relationTargetFieldMetadataUniversalIdentifier: '3edf573b-b06d-4429-ba05-fd6f6925b6d3',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
