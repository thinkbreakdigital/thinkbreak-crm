import { defineObject, FieldType } from 'twenty-sdk/define';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '23699191-31de-44f5-9019-0899feb42fa3';

export default defineObject({
  universalIdentifier: '903cc99d-46d8-46aa-b776-a7c503846e07',
  nameSingular: 'dealContact',
  namePlural: 'dealContacts',
  labelSingular: 'Deal contact',
  labelPlural: 'Deal contacts',
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
      description: 'Name of the dealContact',
      icon: 'IconAbc',
    },
  ],
});
