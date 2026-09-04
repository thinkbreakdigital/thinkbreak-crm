import { defineObject, FieldType } from 'twenty-sdk/define';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '33391310-8078-48f2-ace9-2d41d6e75100';

export default defineObject({
  universalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  nameSingular: 'project',
  namePlural: 'projects',
  labelSingular: 'Project',
  labelPlural: 'Projects',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the project',
      icon: 'IconAbc',
    },
  ],
});
