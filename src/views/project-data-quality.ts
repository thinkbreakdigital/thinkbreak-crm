import {
  defineView,
  ViewFilterGroupLogicalOperator,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';

const PROJECT_OBJECT = 'c3ad642e-8d67-491c-99c2-deddbe39f173';
const PROJECT_NAME_FIELD = '33391310-8078-48f2-ace9-2d41d6e75100';
const PROJECT_STATUS_FIELD = 'e00ad7cd-a0ae-47d3-87ca-79cc9f9f2a1d';
const PROJECT_BILLING_TYPE_FIELD = '3dd3080b-ef78-4602-b69c-86f1d5781f88';
const PROJECT_VALUE_FIELD = '7513009e-51dc-469b-990a-fd87c591a9ae';
const MISSING_REVENUE_INPUTS_GROUP = 'b2c0f33d-b4ca-4d45-ba07-f94aef36bd63';

export default defineView({
  universalIdentifier: 'eab1d547-2f91-4f8d-a555-3bf84d674dd9',
  name: 'Project data quality',
  objectUniversalIdentifier: PROJECT_OBJECT,
  icon: 'IconAlertCircle',
  position: 2,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'e371d137-19d8-4182-ae06-37fc831e5e7d',
      fieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD,
      position: 0,
    },
    {
      universalIdentifier: 'ca4dab21-4224-4f8d-95b1-1d078c441cb4',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
      position: 1,
    },
    {
      universalIdentifier: '4c0b00a8-984b-4104-ba2b-b3205334f787',
      fieldMetadataUniversalIdentifier: PROJECT_BILLING_TYPE_FIELD,
      position: 2,
    },
    {
      universalIdentifier: '5e078cd7-88cd-440f-bfd2-6aa45b9c859a',
      fieldMetadataUniversalIdentifier: PROJECT_VALUE_FIELD,
      position: 3,
    },
  ],
  filterGroups: [
    {
      universalIdentifier: MISSING_REVENUE_INPUTS_GROUP,
      logicalOperator: ViewFilterGroupLogicalOperator.OR,
    },
  ],
  filters: [
    {
      universalIdentifier: 'bd4d6892-cbae-424d-8e46-4de5c146dd58',
      fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: MISSING_REVENUE_INPUTS_GROUP,
      positionInViewFilterGroup: 0,
    },
    {
      universalIdentifier: '79864483-f2d6-4a63-bd8f-effd0964d7b1',
      fieldMetadataUniversalIdentifier: PROJECT_BILLING_TYPE_FIELD,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: MISSING_REVENUE_INPUTS_GROUP,
      positionInViewFilterGroup: 1,
    },
    {
      universalIdentifier: 'caeba133-7aa2-4425-9cea-54ac6c8f7a77',
      fieldMetadataUniversalIdentifier: PROJECT_VALUE_FIELD,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
      viewFilterGroupUniversalIdentifier: MISSING_REVENUE_INPUTS_GROUP,
      positionInViewFilterGroup: 2,
    },
  ],
});
