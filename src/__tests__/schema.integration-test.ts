import { CoreApiClient } from 'twenty-client-sdk/core';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { appDevOnce } from 'twenty-sdk/cli';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import {
  cleanupDerivedValueRecord,
  pollForDerivedValue,
} from 'src/__tests__/derived-value-test-helpers';
import { describe, expect, it } from 'vitest';

type IndustryRecord = {
  id: string;
  name: string;
};

type IndustryClient = {
  mutation: (selection: unknown) => Promise<{
    createIndustry?: IndustryRecord;
  }>;
  query: (selection: unknown) => Promise<{
    industry?: IndustryRecord;
  }>;
};

type CurrencyValue = {
  amountMicros: number;
  currencyCode: string;
};

type DerivedValueClient = {
  mutation: (selection: unknown) => Promise<{
    createDeal?: { id: string };
    updateDeal?: { id: string };
    destroyDeal?: { id: string };
    createProject?: { id: string };
    updateProject?: { id: string };
    destroyProject?: { id: string };
  }>;
  query: (selection: unknown) => Promise<{
    deal?: {
      id: string;
      probability: number | null;
      weightedValue: CurrencyValue | null;
    };
    project?: { id: string; annualizedValue: CurrencyValue | null };
  }>;
};

describe('App installation', () => {
  it('should find the installed app in the applications list', async () => {
    const client = new MetadataApiClient();

    const result = await client.query({
      findManyApplications: {
        id: true,
        name: true,
        universalIdentifier: true,
      },
    });

    const app = result.findManyApplications.find(
      (a: { universalIdentifier: string }) =>
        a.universalIdentifier === APPLICATION_UNIVERSAL_IDENTIFIER,
    );

    expect(app).toBeDefined();
  });
});

describe('CoreApiClient', () => {
  it('should support CRUD on standard objects', async () => {
    const client = new CoreApiClient();

    const created = await client.mutation({
      createNote: {
        __args: { data: { title: 'Integration test note' } },
        id: true,
      },
    });
    const createdNote = created.createNote;

    if (!createdNote) {
      throw new Error('Twenty did not return the note created by the test.');
    }

    expect(createdNote.id).toBeDefined();

    await client.mutation({
      destroyNote: {
        __args: { id: createdNote.id },
        id: true,
      },
    });
  });
});

describe('Industry records', () => {
  it('should preserve a workspace-created Industry across an app sync', async () => {
    const client = new CoreApiClient() as unknown as IndustryClient;

    const created = await client.mutation({
      createIndustry: {
        __args: { data: { name: 'Integration test industry' } },
        id: true,
        name: true,
      },
    });
    const createdIndustry = created.createIndustry;

    if (!createdIndustry) {
      throw new Error('Twenty did not return the Industry created by the test.');
    }

    const syncResult = await appDevOnce({ appPath: process.cwd() });

    if (!syncResult.success) {
      throw new Error(
        `Second app sync failed: ${syncResult.error?.message ?? 'Unknown error'}`,
      );
    }

    const result = await client.query({
      industry: {
        __args: { filter: { id: { eq: createdIndustry.id } } },
        id: true,
        name: true,
      },
    });

    expect(result.industry).toEqual({
      id: createdIndustry.id,
      name: 'Integration test industry',
    });
  });
});

describe('Derived values', () => {
  it('sets Deal probability and weighted value after input changes', async () => {
    const client = new CoreApiClient() as unknown as DerivedValueClient;
    const originalValue = {
      amountMicros: 10_000_000,
      currencyCode: 'USD',
    };
    const updatedValue = {
      amountMicros: 12_000_000,
      currencyCode: 'USD',
    };
    let dealId: string | undefined;
    let testError: unknown;

    try {
      const created = await client.mutation({
        createDeal: {
          __args: {
            data: {
              name: 'Integration test derived Deal',
              stage: 'OUTREACH',
              value: originalValue,
            },
          },
          id: true,
        },
      });
      dealId = created.createDeal?.id;

      if (!dealId) {
        throw new Error('Twenty did not return the Deal created by the test.');
      }

      const readDealDerivedValues = async (): Promise<
        | {
            probability: number | null;
            weightedValue: CurrencyValue | null;
          }
        | undefined
      > => {
        const result = await client.query({
          deal: {
            __args: { filter: { id: { eq: dealId } } },
            id: true,
            probability: true,
            weightedValue: {
              amountMicros: true,
              currencyCode: true,
            },
          },
        });

        return result.deal;
      };

      const createdDerivedValues = await pollForDerivedValue({
        description: `Deal ${dealId} derived values to reflect its stage and value after creation`,
        read: readDealDerivedValues,
        matches: (deal) =>
          deal?.probability === 0.2 &&
          deal.weightedValue?.amountMicros === 2_000_000 &&
          deal.weightedValue.currencyCode === 'USD',
      });

      expect(createdDerivedValues).toEqual({
        id: dealId,
        probability: 0.2,
        weightedValue: {
          amountMicros: 2_000_000,
          currencyCode: 'USD',
        },
      });

      await client.mutation({
        updateDeal: {
          __args: { id: dealId, data: { stage: 'QUOTE' } },
          id: true,
        },
      });

      const stageUpdatedDerivedValues = await pollForDerivedValue({
        description: `Deal ${dealId} derived values to reflect its updated stage`,
        read: readDealDerivedValues,
        matches: (deal) =>
          deal?.probability === 0.75 &&
          deal.weightedValue?.amountMicros === 7_500_000 &&
          deal.weightedValue.currencyCode === 'USD',
      });

      expect(stageUpdatedDerivedValues).toEqual({
        id: dealId,
        probability: 0.75,
        weightedValue: {
          amountMicros: 7_500_000,
          currencyCode: 'USD',
        },
      });

      await client.mutation({
        updateDeal: {
          __args: { id: dealId, data: { value: updatedValue } },
          id: true,
        },
      });

      const valueUpdatedDerivedValues = await pollForDerivedValue({
        description: `Deal ${dealId} weighted value to reflect its updated value`,
        read: readDealDerivedValues,
        matches: (deal) =>
          deal?.probability === 0.75 &&
          deal.weightedValue?.amountMicros === 9_000_000 &&
          deal.weightedValue.currencyCode === 'USD',
      });

      expect(valueUpdatedDerivedValues).toEqual({
        id: dealId,
        probability: 0.75,
        weightedValue: {
          amountMicros: 9_000_000,
          currencyCode: 'USD',
        },
      });
    } catch (error) {
      testError = error;
      throw error;
    } finally {
      if (dealId) {
        await cleanupDerivedValueRecord({
          description: `Deal ${dealId}`,
          destroy: () =>
            client.mutation({
              destroyDeal: {
                __args: { id: dealId },
                id: true,
              },
            }),
          testError,
        });
      }
    }
  });

  it('sets Project annualized value after create and billing input update events', async () => {
    const client = new CoreApiClient() as unknown as DerivedValueClient;
    const originalValue = {
      amountMicros: 2_500_000,
      currencyCode: 'USD',
    };
    const updatedValue = {
      amountMicros: 3_750_000,
      currencyCode: 'USD',
    };
    let projectId: string | undefined;
    let testError: unknown;

    try {
      const created = await client.mutation({
        createProject: {
          __args: {
            data: {
              name: 'Integration test derived Project',
              billingType: 'RECURRING',
              value: originalValue,
              startDate: '2026-01-01',
            },
          },
          id: true,
        },
      });
      projectId = created.createProject?.id;

      if (!projectId) {
        throw new Error('Twenty did not return the Project created by the test.');
      }

      const readAnnualizedValue = async (): Promise<CurrencyValue | null | undefined> => {
        const result = await client.query({
          project: {
            __args: { filter: { id: { eq: projectId } } },
            id: true,
            annualizedValue: {
              amountMicros: true,
              currencyCode: true,
            },
          },
        });

        return result.project?.annualizedValue;
      };

      const createdAnnualizedValue = await pollForDerivedValue({
        description: `Project ${projectId} annualized value to reflect its recurring value after creation`,
        read: readAnnualizedValue,
        matches: (value) =>
          value?.amountMicros === 30_000_000 && value.currencyCode === 'USD',
      });

      expect(createdAnnualizedValue).toEqual({
        amountMicros: 30_000_000,
        currencyCode: 'USD',
      });

      await client.mutation({
        updateProject: {
          __args: { id: projectId, data: { value: updatedValue } },
          id: true,
        },
      });

      const valueUpdatedAnnualizedValue = await pollForDerivedValue({
        description: `Project ${projectId} annualized value to reflect its updated recurring value`,
        read: readAnnualizedValue,
        matches: (value) =>
          value?.amountMicros === 45_000_000 && value.currencyCode === 'USD',
      });

      expect(valueUpdatedAnnualizedValue).toEqual({
        amountMicros: 45_000_000,
        currencyCode: 'USD',
      });

      await client.mutation({
        updateProject: {
          __args: { id: projectId, data: { billingType: 'SINGULAR' } },
          id: true,
        },
      });

      const billingTypeUpdatedAnnualizedValue = await pollForDerivedValue({
        description: `Project ${projectId} annualized value to reflect its singular billing type`,
        read: readAnnualizedValue,
        matches: (value) =>
          value?.amountMicros === 3_750_000 && value.currencyCode === 'USD',
      });

      expect(billingTypeUpdatedAnnualizedValue).toEqual(updatedValue);
    } catch (error) {
      testError = error;
      throw error;
    } finally {
      if (projectId) {
        await cleanupDerivedValueRecord({
          description: `Project ${projectId}`,
          destroy: () =>
            client.mutation({
              destroyProject: {
                __args: { id: projectId },
                id: true,
              },
            }),
          testError,
        });
      }
    }
  });
});
