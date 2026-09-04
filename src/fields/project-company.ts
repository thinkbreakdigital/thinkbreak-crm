import { defineField, FieldType, RelationType, OnDeleteAction } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'ae5da5ef-78bc-408e-bc83-0c38b9a9a2a8',
  name: 'company',
  label: 'Company',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetFieldMetadataUniversalIdentifier: 'bdaeb9e1-5c0f-47b9-8c2c-555e6e505de0',
  universalSettings: { relationType: RelationType.MANY_TO_ONE, onDelete: OnDeleteAction.SET_NULL, joinColumnName: 'companyId' },
});
