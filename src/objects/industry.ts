import { defineObject, FieldType } from 'twenty-sdk/define';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '417e214d-0d69-4284-af10-fb5297d176e4';

export default defineObject({
  universalIdentifier: 'a3816deb-22ba-49b0-ab2b-94cae3842e08',
  nameSingular: 'industry',
  namePlural: 'industries',
  labelSingular: 'Industry',
  labelPlural: 'Industries',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the industry',
      icon: 'IconAbc',
    },
  ],
});
