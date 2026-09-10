import { defineLogicFunction } from 'twenty-sdk/define';

import { updateDealWeightedValue } from 'src/logic-functions/update-deal-weighted-value';

export default defineLogicFunction({
  universalIdentifier: '688b1156-d86d-4dc8-8722-47de8fe3c0a9',
  name: 'updateDealWeightedValueOnUpdate',
  description: 'Updates Deal weighted value when its inputs change.',
  databaseEventTriggerSettings: {
    eventName: 'deal.updated',
    updatedFields: ['probability', 'value'],
  },
  handler: updateDealWeightedValue,
});
