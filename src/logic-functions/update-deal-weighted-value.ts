import { defineLogicFunction, type DatabaseEventPayload } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import {
  calculateDealWeightedValue,
  type CurrencyValue,
} from 'src/logic-functions/derived-values';

const hasSameCurrencyValue = (
  left: CurrencyValue | null,
  right: CurrencyValue | null,
): boolean => {
  return (
    left?.amountMicros === right?.amountMicros &&
    left?.currencyCode === right?.currencyCode
  );
};

export const updateDealWeightedValue = async (
  payload: DatabaseEventPayload,
): Promise<void> => {
  const client = new CoreApiClient();
  const result = await client.query({
    deal: {
      __args: { filter: { id: { eq: payload.recordId } } },
      id: true,
      probability: true,
      value: { amountMicros: true, currencyCode: true },
      weightedValue: { amountMicros: true, currencyCode: true },
    },
  });
  const deal = result.deal;

  if (!deal) {
    throw new Error(`Deal ${payload.recordId} was not found.`);
  }

  const weightedValue = calculateDealWeightedValue(
    deal.probability,
    deal.value as CurrencyValue | null,
  );

  if (
    hasSameCurrencyValue(
      deal.weightedValue as CurrencyValue | null,
      weightedValue,
    )
  ) {
    return;
  }

  await client.mutation({
    updateDeal: {
      __args: { id: deal.id, data: { weightedValue } },
      id: true,
    },
  });
};

export default defineLogicFunction({
  universalIdentifier: 'b408723d-31ff-49ad-8f1d-6872b8a88240',
  name: 'updateDealWeightedValue',
  description: 'Updates Deal weighted value when it is created.',
  databaseEventTriggerSettings: {
    eventName: 'deal.created',
  },
  handler: updateDealWeightedValue,
});
