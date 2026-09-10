import { defineView, ViewType } from 'twenty-sdk/define';

const PROJECT_NAME_FIELD = '33391310-8078-48f2-ace9-2d41d6e75100';
const PROJECT_STATUS_FIELD = 'e00ad7cd-a0ae-47d3-87ca-79cc9f9f2a1d';
const PROJECT_BILLING_TYPE_FIELD = '3dd3080b-ef78-4602-b69c-86f1d5781f88';
const PROJECT_ANNUALIZED_VALUE_FIELD = '2a61fee5-e886-4351-a420-e5e271c7cd75';

export default defineView({
  universalIdentifier: 'c424e88e-fbee-485b-8b4b-b59428c5b9c6',
  name: 'Projects list',
  objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
  icon: 'IconList',
  position: 0,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '9705b9fa-d646-46bc-b06a-a577f20db3b4',
      fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD,
      position: 0,
    },
    {
      universalIdentifier: 'ba530e6a-27b8-41e6-b94e-3461faab81e5',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
      position: 1,
    },
    {
      universalIdentifier: '96787186-ae13-4d4c-adb1-7e5108dd8233',
      fieldMetadataUniversalIdentifier: PROJECT_BILLING_TYPE_FIELD,
      position: 2,
    },
    {
      universalIdentifier: '1fd12c5a-2e93-460e-b82f-2e1d8cb8c01b',
      fieldMetadataUniversalIdentifier: PROJECT_ANNUALIZED_VALUE_FIELD,
      position: 3,
    },
  ],
});
