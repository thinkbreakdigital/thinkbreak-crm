import {
  defineView,
  getFieldUniversalIdentifier,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

const DEAL_OBJECT = 'cca977ba-ccd0-4734-892d-ae53118d9d34';
const DEAL_NAME_FIELD = '3c4b4a54-a187-437d-86b5-b7afc86292c5';
const DEAL_STAGE_FIELD = 'bc9ce40a-1bd4-45cd-a391-b67dd59b3563';
const DEAL_PROBABILITY_FIELD = '28456522-dc92-42de-85c5-42313f24dd37';
const DEAL_VALUE_FIELD = 'dc9c7c49-f860-4a47-a7ba-8723067fda5a';
const DEAL_UPDATED_AT_FIELD = getFieldUniversalIdentifier({
  applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: DEAL_OBJECT,
  name: 'updatedAt',
});

export default defineView({
  universalIdentifier: '48120c6b-2448-4d91-83b3-11adc82a43fa',
  name: 'Open Deals',
  objectUniversalIdentifier: DEAL_OBJECT,
  icon: 'IconBriefcase',
  position: 1,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '75e4ffdb-1048-4021-ad6a-dfea17a66e01',
      fieldMetadataUniversalIdentifier: DEAL_NAME_FIELD,
      position: 0,
    },
    {
      universalIdentifier: '03e2f6ce-0f4e-4923-be5c-77a3c2c6f026',
      fieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
      position: 1,
    },
    {
      universalIdentifier: '16bb1109-d796-447a-8fc5-0c80a10cc80c',
      fieldMetadataUniversalIdentifier: DEAL_PROBABILITY_FIELD,
      position: 2,
    },
    {
      universalIdentifier: 'dd3a026b-2175-413a-8267-a2c6011fafd0',
      fieldMetadataUniversalIdentifier: DEAL_VALUE_FIELD,
      position: 3,
    },
  ],
  filters: [
    {
      universalIdentifier: '3a13d233-bc74-401f-8e53-b2e2ae6d04c9',
      fieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
      operand: ViewFilterOperand.IS_NOT,
      value: 'WON',
    },
    {
      universalIdentifier: 'd015ee4e-d2d8-4877-b006-07622380b427',
      fieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
      operand: ViewFilterOperand.IS_NOT,
      value: 'LOST',
    },
  ],
  sorts: [
    {
      universalIdentifier: '25db3945-ebd1-4190-83ce-8c3ba791c302',
      fieldMetadataUniversalIdentifier: DEAL_UPDATED_AT_FIELD,
      direction: ViewSortDirection.DESC,
    },
  ],
});
