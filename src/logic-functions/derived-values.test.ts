import { describe, expect, it } from 'vitest';

import {
  calculateAnnualizedValue,
  calculateDealProbability,
  calculateDealWeightedValue,
} from './derived-values';

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

  it('stops for an unknown billing type', () => {
    expect(() =>
      calculateAnnualizedValue('UNKNOWN', {
        amountMicros: 1,
        currencyCode: 'USD',
      }),
    ).toThrow('unknown billing type');
  });
});

describe('calculateDealProbability', () => {
  it('maps every configured Deal stage', () => {
    expect(calculateDealProbability('PIPELINE')).toBe(0.1);
    expect(calculateDealProbability('OUTREACH')).toBe(0.2);
    expect(calculateDealProbability('APPT_SET')).toBe(0.3);
    expect(calculateDealProbability('APPT_MET')).toBe(0.5);
    expect(calculateDealProbability('QUOTE')).toBe(0.75);
    expect(calculateDealProbability('WON')).toBe(1);
    expect(calculateDealProbability('LOST')).toBe(0);
  });

  it('stops for an unknown stage', () => {
    expect(() => calculateDealProbability('UNKNOWN')).toThrow('unmapped stage');
  });

  it('returns empty when the stage is missing', () => {
    expect(calculateDealProbability(null)).toBeNull();
  });
});

describe('calculateDealWeightedValue', () => {
  it('weights currency by a stored probability ratio', () => {
    expect(
      calculateDealWeightedValue(0.9, {
        amountMicros: 100_000_000,
        currencyCode: 'USD',
      }),
    ).toEqual({ amountMicros: 90_000_000, currencyCode: 'USD' });
    expect(
      calculateDealWeightedValue(0.2, {
        amountMicros: 100_000_000,
        currencyCode: 'USD',
      }),
    ).toEqual({ amountMicros: 20_000_000, currencyCode: 'USD' });
  });

  it('rounds the result to the nearest currency micro', () => {
    expect(
      calculateDealWeightedValue(0.5, {
        amountMicros: 3,
        currencyCode: 'USD',
      }),
    ).toEqual({ amountMicros: 2, currencyCode: 'USD' });
  });

  it('returns empty when a source value is missing', () => {
    expect(calculateDealWeightedValue(null, null)).toBeNull();
    expect(
      calculateDealWeightedValue(undefined, {
        amountMicros: 100_000_000,
        currencyCode: 'USD',
      }),
    ).toBeNull();
    expect(calculateDealWeightedValue(0.2, null)).toBeNull();
  });

  it('allows the zero and one probability boundaries', () => {
    expect(
      calculateDealWeightedValue(0, {
        amountMicros: 100_000_000,
        currencyCode: 'USD',
      }),
    ).toEqual({ amountMicros: 0, currencyCode: 'USD' });
    expect(
      calculateDealWeightedValue(1, {
        amountMicros: 100_000_000,
        currencyCode: 'USD',
      }),
    ).toEqual({ amountMicros: 100_000_000, currencyCode: 'USD' });
  });

  it('stops for a probability outside the stored ratio range', () => {
    const value = { amountMicros: 100_000_000, currencyCode: 'USD' };

    expect(() => calculateDealWeightedValue(-0.1, value)).toThrow(
      'Expected a ratio from 0 through 1',
    );
    expect(() => calculateDealWeightedValue(1.1, value)).toThrow(
      'Expected a ratio from 0 through 1',
    );
    expect(() => calculateDealWeightedValue(Number.NaN, value)).toThrow(
      'Expected a ratio from 0 through 1',
    );
  });
});
