import { defineObject, FieldType } from 'twenty-sdk/define';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '7fcb1964-047a-4af4-b4f9-02e3983cb8f2';

export default defineObject({
  universalIdentifier: 'd5070997-ad78-40d4-92e0-277c4f85e3a0',
  nameSingular: 'projectContact',
  namePlural: 'projectContacts',
  labelSingular: 'Project contact',
  labelPlural: 'Project contacts',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
  isUICreatable: false,
  isSearchable: false,
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the projectContact',
      icon: 'IconAbc',
    },
  ],
});
