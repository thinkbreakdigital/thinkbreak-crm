import { defineObject, FieldType } from 'twenty-sdk/define';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '3c4b4a54-a187-437d-86b5-b7afc86292c5';

export default defineObject({
  universalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  nameSingular: 'deal',
  namePlural: 'deals',
  labelSingular: 'Deal',
  labelPlural: 'Deals',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the deal',
      icon: 'IconAbc',
    },
  ],
});
