export type CurrencyValue = {
  amountMicros: number;
  currencyCode: string;
};

export const DEAL_STAGE_PROBABILITIES = {
  PIPELINE: 10,
  OUTREACH: 20,
  APPT_SET: 30,
  APPT_MET: 50,
  QUOTE: 75,
  WON: 100,
  LOST: 0,
} as const;

export function calculateAnnualizedValue(
  billingType: string | null | undefined,
  value: CurrencyValue | null | undefined,
): CurrencyValue | null {
  if (!value || !billingType) return null;

  if (billingType === 'RECURRING') {
    return { amountMicros: value.amountMicros * 12, currencyCode: value.currencyCode };
  }

  if (billingType === 'SINGULAR') return { ...value };

  throw new Error(`Cannot annualize Project value for unknown billing type "${billingType}".`);
}

export function calculateDealProbability(stage: string | null | undefined): number | null {
  if (!stage) return null;
  if (stage in DEAL_STAGE_PROBABILITIES) {
    return DEAL_STAGE_PROBABILITIES[stage as keyof typeof DEAL_STAGE_PROBABILITIES];
  }
  throw new Error(`Cannot calculate Deal probability for unmapped stage "${stage}".`);
}
