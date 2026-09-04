import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'bdaeb9e1-5c0f-47b9-8c2c-555e6e505de0',
  name: 'projects',
  label: 'Projects',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetObjectMetadataUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  relationTargetFieldMetadataUniversalIdentifier: 'ae5da5ef-78bc-408e-bc83-0c38b9a9a2a8',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
