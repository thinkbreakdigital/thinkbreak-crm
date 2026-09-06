import { defineLogicFunction } from 'twenty-sdk/define';

import { updateProjectAnnualizedValue } from 'src/logic-functions/update-project-annualized-value';

export default defineLogicFunction({
  universalIdentifier: 'd15abb48-1fbe-4850-afa9-3480929b9112',
  name: 'updateProjectAnnualizedValueOnUpdate',
  description: 'Updates Project annualized value when billing inputs change.',
  databaseEventTriggerSettings: {
    eventName: 'c3ad642e-8d67-491c-99c2-deddbe39f173.updated',
    updatedFields: ['billingType', 'value'],
  },
  handler: updateProjectAnnualizedValue,
});
