import { describe, expect, it } from 'vitest';

import { calculateAnnualizedValue, calculateDealProbability } from './derived-values';

describe('calculateAnnualizedValue', () => {
  it('annualizes recurring currency using integer micros', () => {
    expect(calculateAnnualizedValue('RECURRING', { amountMicros: 125_500_000, currencyCode: 'USD' }))
      .toEqual({ amountMicros: 1_506_000_000, currencyCode: 'USD' });
  });

  it('keeps singular currency unchanged', () => {
    expect(calculateAnnualizedValue('SINGULAR', { amountMicros: 0, currencyCode: 'USD' }))
      .toEqual({ amountMicros: 0, currencyCode: 'USD' });
  });

  it('returns empty when a source value is missing', () => {
    expect(calculateAnnualizedValue('RECURRING', null)).toBeNull();
    expect(calculateAnnualizedValue(null, { amountMicros: 1, currencyCode: 'USD' })).toBeNull();
  });
});

describe('calculateDealProbability', () => {
  it('maps every configured Deal stage', () => {
    expect(calculateDealProbability('PIPELINE')).toBe(10);
    expect(calculateDealProbability('OUTREACH')).toBe(20);
    expect(calculateDealProbability('APPT_SET')).toBe(30);
    expect(calculateDealProbability('APPT_MET')).toBe(50);
    expect(calculateDealProbability('QUOTE')).toBe(75);
    expect(calculateDealProbability('WON')).toBe(100);
    expect(calculateDealProbability('LOST')).toBe(0);
  });

  it('stops for an unknown stage', () => {
    expect(() => calculateDealProbability('UNKNOWN')).toThrow('unmapped stage');
  });
});
