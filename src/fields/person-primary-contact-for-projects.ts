import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '3b0651c5-fb3b-4143-aeac-29dd08371b81',
  name: 'primaryContactForProjects',
  label: 'Primary contact for projects',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
  relationTargetObjectMetadataUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  relationTargetFieldMetadataUniversalIdentifier: 'f8f242d1-29ef-462a-8008-94616c05835a',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
});
