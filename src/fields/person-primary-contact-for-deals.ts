import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '7cf65bf3-a939-4cb9-8c28-44470194c0c2',
  name: 'primaryContactForDeals',
  label: 'Primary contact for deals',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetObjectMetadataUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  relationTargetFieldMetadataUniversalIdentifier: 'dbdcb7d2-7924-403c-9b31-aa42dff50b2b',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
