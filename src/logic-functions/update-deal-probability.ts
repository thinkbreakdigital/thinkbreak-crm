import { defineLogicFunction, type DatabaseEventPayload } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import { calculateDealProbability } from 'src/logic-functions/derived-values';

export const updateDealProbability = async (
  payload: DatabaseEventPayload,
): Promise<void> => {
  const client = new CoreApiClient();
  const result = await client.query({
    deal: {
      __args: { filter: { id: { eq: payload.recordId } } },
      id: true,
      stage: true,
      probability: true,
    },
  });
  const deal = result.deal;

  if (!deal) {
    throw new Error(`Deal ${payload.recordId} was not found.`);
  }

  const probability = calculateDealProbability(deal.stage);

  if (deal.probability === probability) {
    return;
  }

  await client.mutation({
    updateDeal: {
      __args: { id: deal.id, data: { probability } },
      id: true,
    },
  });
};

export default defineLogicFunction({
  universalIdentifier: 'a9e7c007-5037-44d3-8ae6-68564ecc2d30',
  name: 'updateDealProbability',
  description: 'Updates Deal probability when it is created.',
  databaseEventTriggerSettings: {
    eventName: 'deal.created',
  },
  handler: updateDealProbability,
});
