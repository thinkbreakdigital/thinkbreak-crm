import {
  defineField,
  FieldType,
  RelationType,
  OnDeleteAction,
} from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '6e2fde4a-eee5-4fb6-84fe-eaa5e1913398',
  name: 'industry',
  label: 'Industry',
  type: FieldType.RELATION,
  objectUniversalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
  relationTargetObjectMetadataUniversalIdentifier: 'a3816deb-22ba-49b0-ab2b-94cae3842e08',
  relationTargetFieldMetadataUniversalIdentifier: '68ab377e-71f3-405c-88b6-c8185ee0bab2',
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'industryId',
  },
  description: "The company's primary industry.",
});
