import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'c02379ca-811c-413b-8392-fdab55a45169',
  name: 'company',
  label: 'Company',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetFieldMetadataUniversalIdentifier: '4698fdc9-6c20-41d1-bc5f-2bc4e74e9c13',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.SET_NULL, joinColumnName: 'companyId' },
});
