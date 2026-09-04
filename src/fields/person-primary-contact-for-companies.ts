import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '95a9e9ef-5c06-4d24-bdba-06aeb1bbc13b',
  name: 'primaryContactForCompanies',
  label: 'Primary contact for companies',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetFieldMetadataUniversalIdentifier: '9450370e-197c-4da5-ac27-04b069ad5b0d',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
