import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '0c47a56c-e2b4-485f-b4ce-636dcd163f24',
  name: 'contacts',
  label: 'Contacts',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  relationTargetObjectMetadataUniversalIdentifier: '903cc99d-46d8-46aa-b776-a7c503846e07',
  relationTargetFieldMetadataUniversalIdentifier: 'faa2879a-4642-46a5-8737-8d29dabadd65',
  universalSettings: { relationType: RelationType.ONE_TO_MANY, junctionTargetFieldUniversalIdentifier: '3edf573b-b06d-4429-ba05-fd6f6925b6d3' },
});
