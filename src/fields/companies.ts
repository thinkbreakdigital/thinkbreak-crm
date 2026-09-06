import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '68ab377e-71f3-405c-88b6-c8185ee0bab2',
  name: 'companies',
  label: 'Companies',
  type: FieldType.RELATION,
  objectUniversalIdentifier: 'a3816deb-22ba-49b0-ab2b-94cae3842e08',
  relationTargetObjectMetadataUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetFieldMetadataUniversalIdentifier: '6e2fde4a-eee5-4fb6-84fe-eaa5e1913398',
  universalSettings: { relationType: RelationType.ONE_TO_MANY },
  description: 'Companies assigned to this industry.',
});
