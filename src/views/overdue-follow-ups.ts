import { defineView, STANDARD_OBJECT, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

const TASK_OBJECT = STANDARD_OBJECT.task;

export default defineView({
  universalIdentifier: 'aea51fbe-767e-4dcd-97ad-964fa510a739',
  name: 'Overdue follow-ups',
  objectUniversalIdentifier: TASK_OBJECT.universalIdentifier,
  icon: 'IconCheckbox',
  position: 0,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'f1763dc7-dbb1-4589-a551-ea1e81a3df3c',
      fieldMetadataUniversalIdentifier: TASK_OBJECT.fields.title.universalIdentifier,
      position: 0,
    },
    {
      universalIdentifier: 'b9164bb9-ea76-4cac-a2e6-dc7a472d1abe',
      fieldMetadataUniversalIdentifier: TASK_OBJECT.fields.dueAt.universalIdentifier,
      position: 1,
    },
    {
      universalIdentifier: '7d177928-206c-4748-8d04-281be48c328c',
      fieldMetadataUniversalIdentifier: TASK_OBJECT.fields.status.universalIdentifier,
      position: 2,
    },
  ],
  filters: [
    {
      universalIdentifier: '06c92c3c-59ff-4d82-9882-4e7186aeebaf',
      fieldMetadataUniversalIdentifier: TASK_OBJECT.fields.status.universalIdentifier,
      operand: ViewFilterOperand.IS_NOT,
      value: ['DONE'],
    },
    {
      universalIdentifier: '1873be3f-e599-4623-ad2f-aab806e4e0ac',
      fieldMetadataUniversalIdentifier: TASK_OBJECT.fields.dueAt.universalIdentifier,
      operand: ViewFilterOperand.IS_IN_PAST,
      value: '',
    },
  ],
});
