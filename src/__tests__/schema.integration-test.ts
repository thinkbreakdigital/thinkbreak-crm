import { CoreApiClient } from 'twenty-client-sdk/core';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { appDevOnce } from 'twenty-sdk/cli';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
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
