import type { InstallPayload } from 'twenty-sdk/define';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const clientMocks = vi.hoisted(() => ({
  coreMutation: vi.fn(),
  coreQuery: vi.fn(),
  metadataQuery: vi.fn(),
}));

vi.mock('twenty-client-sdk/core', () => ({
  CoreApiClient: class {
    query = clientMocks.coreQuery;
    mutation = clientMocks.coreMutation;
  },
}));

vi.mock('twenty-client-sdk/metadata', () => ({
  MetadataApiClient: class {
    query = clientMocks.metadataQuery;
  },
}));

import {
  OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  OPERATIONAL_DASHBOARD_RECORD_ID,
  OPERATIONAL_DASHBOARD_TITLE,
} from 'src/constants/universal-identifiers';
import { ensureOperationalDashboard } from 'src/logic-functions/ensure-operational-dashboard';
import operationalDashboard from 'src/page-layouts/operational-dashboard';
import activeProjects from 'src/views/active-projects';
import openDeals from 'src/views/open-deals';
import overdueFollowUps from 'src/views/overdue-follow-ups';
import projectDataQuality from 'src/views/project-data-quality';

const PAGE_LAYOUT_ID = 'b0af7b34-c874-489c-916e-230a60cce2bc';

const installPayload = {} as InstallPayload;

describe('dashboard view metadata', () => {
  it('stores SELECT filter values as arrays of option keys', () => {
    expect(activeProjects.success).toBe(true);
    expect(openDeals.success).toBe(true);
    expect(overdueFollowUps.success).toBe(true);
    expect(activeProjects.errors).toEqual([]);
    expect(openDeals.errors).toEqual([]);
    expect(overdueFollowUps.errors).toEqual([]);

    expect(activeProjects.config.filters?.[0]?.value).toEqual(['ACTIVE']);
    expect(openDeals.config.filters?.map((filter) => filter.value)).toEqual([
      ['WON'],
      ['LOST'],
    ]);
    expect(overdueFollowUps.config.filters?.[0]?.value).toEqual(['DONE']);
    expect(overdueFollowUps.config.filters?.[1]?.value).toBe('');
  });

  it('defines the four documented dashboard worklists', () => {
    expect(operationalDashboard.success).toBe(true);
    expect(operationalDashboard.errors).toEqual([]);
    expect(projectDataQuality.success).toBe(true);
    expect(projectDataQuality.errors).toEqual([]);

    expect(operationalDashboard.config).toMatchObject({
      universalIdentifier: OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
      name: OPERATIONAL_DASHBOARD_TITLE,
      type: 'DASHBOARD',
      tabs: [
        {
          universalIdentifier: 'b38f26fe-d6a2-4483-9f63-1f871569072e',
          title: 'Overview',
          position: 0,
          layoutMode: 'GRID',
          widgets: [
            {
              universalIdentifier: '1b145e2f-dd15-43e5-a8a0-c388f72a92c1',
              title: 'Open Deals',
              type: 'RECORD_TABLE',
              position: {
                layoutMode: 'GRID',
                row: 0,
                column: 0,
                rowSpan: 1,
                columnSpan: 1,
              },
              configuration: {
                configurationType: 'RECORD_TABLE',
                viewUniversalIdentifier: openDeals.config.universalIdentifier,
                recordLimit: 10,
              },
            },
            {
              universalIdentifier: '4e9cd6d2-c687-481e-970a-cdd01f48d574',
              title: 'Active Projects',
              type: 'RECORD_TABLE',
              position: {
                layoutMode: 'GRID',
                row: 0,
                column: 1,
                rowSpan: 1,
                columnSpan: 1,
              },
              configuration: {
                configurationType: 'RECORD_TABLE',
                viewUniversalIdentifier: activeProjects.config.universalIdentifier,
                recordLimit: 10,
              },
            },
            {
              universalIdentifier: '9362c0bf-5d94-441f-9bd0-2e0f2a8de7c4',
              title: 'Overdue follow-ups',
              type: 'RECORD_TABLE',
              position: {
                layoutMode: 'GRID',
                row: 1,
                column: 0,
                rowSpan: 1,
                columnSpan: 1,
              },
              configuration: {
                configurationType: 'RECORD_TABLE',
                viewUniversalIdentifier: overdueFollowUps.config.universalIdentifier,
                recordLimit: 10,
              },
            },
            {
              universalIdentifier: '35b659a8-69a3-49c2-8b44-edf8e451eb5b',
              title: 'Data quality',
              type: 'RECORD_TABLE',
              position: {
                layoutMode: 'GRID',
                row: 1,
                column: 1,
                rowSpan: 1,
                columnSpan: 1,
              },
              configuration: {
                configurationType: 'RECORD_TABLE',
                viewUniversalIdentifier: projectDataQuality.config.universalIdentifier,
                recordLimit: 10,
              },
            },
          ],
        },
      ],
    });
  });
});

describe('ensureOperationalDashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    clientMocks.metadataQuery.mockResolvedValue({
      getPageLayouts: [
        {
          id: PAGE_LAYOUT_ID,
          type: 'DASHBOARD',
          universalIdentifier: OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
        },
      ],
    });
  });

  it('creates the Dashboard record when Twenty reports NOT_FOUND', async () => {
    clientMocks.coreQuery.mockRejectedValue({
      errors: [
        {
          message: 'Dashboard record was not found.',
          extensions: { code: 'NOT_FOUND' },
        },
      ],
    });
    clientMocks.coreMutation.mockResolvedValue({
      createDashboard: { id: OPERATIONAL_DASHBOARD_RECORD_ID },
    });

    await ensureOperationalDashboard(installPayload);

    expect(clientMocks.coreMutation).toHaveBeenCalledOnce();
    expect(clientMocks.coreMutation).toHaveBeenCalledWith({
      createDashboard: {
        __args: {
          data: {
            id: OPERATIONAL_DASHBOARD_RECORD_ID,
            pageLayoutId: PAGE_LAYOUT_ID,
            title: OPERATIONAL_DASHBOARD_TITLE,
          },
        },
        id: true,
      },
    });
  });

  it('does not hide GraphQL errors other than NOT_FOUND', async () => {
    const error = {
      errors: [
        {
          message: 'The application is not authorized.',
          extensions: { code: 'FORBIDDEN' },
        },
      ],
    };
    clientMocks.coreQuery.mockRejectedValue(error);

    await expect(ensureOperationalDashboard(installPayload)).rejects.toBe(error);
    expect(clientMocks.coreMutation).not.toHaveBeenCalled();
  });

  it('does not hide a mixed NOT_FOUND and server error response', async () => {
    const error = {
      errors: [
        { message: 'Dashboard record was not found.', extensions: { code: 'NOT_FOUND' } },
        { message: 'Database request failed.', extensions: { code: 'INTERNAL_SERVER_ERROR' } },
      ],
    };
    clientMocks.coreQuery.mockRejectedValue(error);

    await expect(ensureOperationalDashboard(installPayload)).rejects.toBe(error);
    expect(clientMocks.coreMutation).not.toHaveBeenCalled();
  });

  it('repairs a Dashboard record with the wrong title or layout', async () => {
    clientMocks.coreQuery.mockResolvedValue({
      dashboard: {
        id: OPERATIONAL_DASHBOARD_RECORD_ID,
        pageLayoutId: 'b565487d-61f8-4191-bb37-51b15fadac56',
        title: 'Old dashboard',
      },
    });
    clientMocks.coreMutation.mockResolvedValue({
      updateDashboard: { id: OPERATIONAL_DASHBOARD_RECORD_ID },
    });

    await ensureOperationalDashboard(installPayload);

    expect(clientMocks.coreMutation).toHaveBeenCalledOnce();
    expect(clientMocks.coreMutation).toHaveBeenCalledWith({
      updateDashboard: {
        __args: {
          id: OPERATIONAL_DASHBOARD_RECORD_ID,
          data: {
            pageLayoutId: PAGE_LAYOUT_ID,
            title: OPERATIONAL_DASHBOARD_TITLE,
          },
        },
        id: true,
      },
    });
  });

  it('does not write when the Dashboard record is already correct', async () => {
    clientMocks.coreQuery.mockResolvedValue({
      dashboard: {
        id: OPERATIONAL_DASHBOARD_RECORD_ID,
        pageLayoutId: PAGE_LAYOUT_ID,
        title: OPERATIONAL_DASHBOARD_TITLE,
      },
    });

    await ensureOperationalDashboard(installPayload);

    expect(clientMocks.coreMutation).not.toHaveBeenCalled();
  });
});
