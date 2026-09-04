import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '21f76e43-1312-4203-a182-ffe945f2ed7f',
  name: 'contacts',
  label: 'Contacts',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  relationTargetObjectMetadataUniversalIdentifier: 'd5070997-ad78-40d4-92e0-277c4f85e3a0',
  relationTargetFieldMetadataUniversalIdentifier: 'd670e9e5-d937-40bd-ac7f-1f4f561b5a94',
  universalSettings: { relationType: RelationType.ONE_TO_MANY, junctionTargetFieldUniversalIdentifier: '4b384dac-d74b-4c5e-bc09-e875704a5985' },
});
