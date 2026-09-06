import { defineLogicFunction, type DatabaseEventPayload } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import {
  calculateAnnualizedValue,
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

export const updateProjectAnnualizedValue = async (
  payload: DatabaseEventPayload,
): Promise<void> => {
  const client = new CoreApiClient();
  const result = await client.query({
    project: {
      __args: { filter: { id: { eq: payload.recordId } } },
      id: true,
      billingType: true,
      value: { amountMicros: true, currencyCode: true },
      annualizedValue: { amountMicros: true, currencyCode: true },
    },
  });
  const project = result.project;

  if (!project) {
    throw new Error(`Project ${payload.recordId} was not found.`);
  }

  const annualizedValue = calculateAnnualizedValue(
    project.billingType,
    project.value as CurrencyValue | null,
  );

  if (
    hasSameCurrencyValue(
      project.annualizedValue as CurrencyValue | null,
      annualizedValue,
    )
  ) {
    return;
  }

  await client.mutation({
    updateProject: {
      __args: { id: project.id, data: { annualizedValue } },
      id: true,
    },
  });
};

export default defineLogicFunction({
  universalIdentifier: '0d404833-c72e-48cb-ad09-f03573d1bc13',
  name: 'updateProjectAnnualizedValue',
  description: 'Updates Project annualized value when it is created.',
  databaseEventTriggerSettings: {
    eventName: 'project.created',
  },
  handler: updateProjectAnnualizedValue,
});
