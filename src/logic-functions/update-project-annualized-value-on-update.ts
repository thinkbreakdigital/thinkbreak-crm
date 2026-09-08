import { defineLogicFunction } from 'twenty-sdk/define';

import { updateProjectAnnualizedValue } from 'src/logic-functions/update-project-annualized-value';

export default defineLogicFunction({
  universalIdentifier: 'd15abb48-1fbe-4850-afa9-3480929b9112',
  name: 'updateProjectAnnualizedValueOnUpdate',
  description: 'Updates Project annualized value when billing inputs change.',
  databaseEventTriggerSettings: {
    eventName: 'project.updated',
    updatedFields: ['billingType', 'value'],
  },
  handler: updateProjectAnnualizedValue,
});
