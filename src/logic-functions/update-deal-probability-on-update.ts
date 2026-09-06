import { defineLogicFunction } from 'twenty-sdk/define';

import { updateDealProbability } from 'src/logic-functions/update-deal-probability';

export default defineLogicFunction({
  universalIdentifier: 'fcb50c85-e4a8-4d6f-b91e-a9af7910c1ee',
  name: 'updateDealProbabilityOnUpdate',
  description: 'Updates Deal probability when its stage changes.',
  databaseEventTriggerSettings: {
    eventName: 'deal.updated',
    updatedFields: ['stage'],
  },
  handler: updateDealProbability,
});
