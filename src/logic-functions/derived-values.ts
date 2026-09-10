export type CurrencyValue = {
  amountMicros: number;
  currencyCode: string;
};

export const DEAL_STAGE_PROBABILITIES = {
  PIPELINE: 0.1,
  OUTREACH: 0.2,
  APPT_SET: 0.3,
  APPT_MET: 0.5,
  QUOTE: 0.75,
  WON: 1,
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

export function calculateDealWeightedValue(
  probability: number | null | undefined,
  value: CurrencyValue | null | undefined,
): CurrencyValue | null {
  if (!value || probability === null || probability === undefined) return null;

  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new Error(
      `Cannot calculate Deal weighted value for probability "${probability}". Expected a ratio from 0 through 1.`,
    );
  }

  return {
    amountMicros: Math.round(value.amountMicros * probability),
    currencyCode: value.currencyCode,
  };
}
