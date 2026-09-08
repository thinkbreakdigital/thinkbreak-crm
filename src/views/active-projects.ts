import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

const PROJECT_OBJECT = 'c3ad642e-8d67-491c-99c2-deddbe39f173';
const PROJECT_NAME_FIELD = '33391310-8078-48f2-ace9-2d41d6e75100';
const PROJECT_STATUS_FIELD = 'e00ad7cd-a0ae-47d3-87ca-79cc9f9f2a1d';
const PROJECT_BILLING_TYPE_FIELD = '3dd3080b-ef78-4602-b69c-86f1d5781f88';
const PROJECT_ANNUALIZED_VALUE_FIELD = '2a61fee5-e886-4351-a420-e5e271c7cd75';

export default defineView({
  universalIdentifier: '532b5e98-8ce9-46dd-9e78-53fe9f58e83b',
  name: 'Active Projects',
  objectUniversalIdentifier: PROJECT_OBJECT,
  icon: 'IconBriefcase',
  position: 1,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '3959b461-dd67-4355-a6e0-b31de187b94e',
      fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD,
      position: 0,
    },
    {
      universalIdentifier: '1216d75f-4faf-4a2d-9d77-f66768c5f2bf',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
      position: 1,
    },
    {
      universalIdentifier: '853e270c-ff0c-4ab9-a2c3-eec5e311dfd3',
      fieldMetadataUniversalIdentifier: PROJECT_BILLING_TYPE_FIELD,
      position: 2,
    },
    {
      universalIdentifier: '5d149202-369f-4a7f-83e6-c0f6b185a25d',
      fieldMetadataUniversalIdentifier: PROJECT_ANNUALIZED_VALUE_FIELD,
      position: 3,
    },
  ],
  filters: [
    {
      universalIdentifier: 'c92fd9d8-07d7-4d9e-afa8-95cecbd9d0b5',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
      operand: ViewFilterOperand.IS,
      value: ['ACTIVE'],
    },
  ],
  sorts: [
    {
      universalIdentifier: '99822b4f-425f-4b3d-8104-84e1475e6441',
      fieldMetadataUniversalIdentifier: PROJECT_ANNUALIZED_VALUE_FIELD,
      direction: ViewSortDirection.DESC,
    },
  ],
});
