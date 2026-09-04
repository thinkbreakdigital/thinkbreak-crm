import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '4698fdc9-6c20-41d1-bc5f-2bc4e74e9c13',
  name: 'deals',
  label: 'Deals',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetObjectMetadataUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  relationTargetFieldMetadataUniversalIdentifier: 'c02379ca-811c-413b-8392-fdab55a45169',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
