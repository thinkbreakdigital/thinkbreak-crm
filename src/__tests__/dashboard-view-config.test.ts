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
import projectsList from 'src/views/projects-list';

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
      ['PIPELINE'],
      ['WON'],
      ['LOST'],
    ]);
    expect(overdueFollowUps.config.filters?.[0]?.value).toEqual(['DONE']);
    expect(overdueFollowUps.config.filters?.[1]?.value).toBe('');
  });

  it('defines the captured three-tab operational dashboard', () => {
    expect(operationalDashboard.success).toBe(true);
    expect(operationalDashboard.errors).toEqual([]);

    const tabs = operationalDashboard.config.tabs ?? [];
    const widgets = tabs.flatMap((tab) => tab.widgets ?? []);

    expect(operationalDashboard.config).toMatchObject({
      universalIdentifier: OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
      name: OPERATIONAL_DASHBOARD_TITLE,
      type: 'DASHBOARD',
    });
    expect(tabs.map(({ title, position }) => ({ title, position }))).toEqual([
      { title: 'Overview', position: 0 },
      { title: 'Pipeline', position: 1 },
      { title: 'Operations', position: 2 },
    ]);
    expect(widgets).toHaveLength(14);
    expect(
      widgets.map(({ title, type, configuration, position }) => ({
        title,
        type,
        configurationType: configuration?.configurationType,
        position,
      })),
    ).toEqual([
      {
        title: 'Deals by Stage',
        type: 'GRAPH',
        configurationType: 'PIE_CHART',
        position: { layoutMode: 'GRID', row: 0, column: 0, rowSpan: 6, columnSpan: 6 },
      },
      {
        title: 'Companies by Industry',
        type: 'GRAPH',
        configurationType: 'BAR_CHART',
        position: { layoutMode: 'GRID', row: 0, column: 6, rowSpan: 6, columnSpan: 6 },
      },
      {
        title: 'Current Revenue',
        type: 'GRAPH',
        configurationType: 'AGGREGATE_CHART',
        position: { layoutMode: 'GRID', row: 6, column: 0, rowSpan: 2, columnSpan: 3 },
      },
      {
        title: 'Projected Revenue',
        type: 'GRAPH',
        configurationType: 'AGGREGATE_CHART',
        position: { layoutMode: 'GRID', row: 6, column: 3, rowSpan: 2, columnSpan: 3 },
      },
      {
        title: 'Open Deals',
        type: 'GRAPH',
        configurationType: 'AGGREGATE_CHART',
        position: { layoutMode: 'GRID', row: 6, column: 6, rowSpan: 2, columnSpan: 3 },
      },
      {
        title: 'Project Data Gaps',
        type: 'GRAPH',
        configurationType: 'AGGREGATE_CHART',
        position: { layoutMode: 'GRID', row: 6, column: 9, rowSpan: 2, columnSpan: 3 },
      },
      {
        title: 'Revenue Trends',
        type: 'GRAPH',
        configurationType: 'LINE_CHART',
        position: { layoutMode: 'GRID', row: 8, column: 0, rowSpan: 6, columnSpan: 12 },
      },
      {
        title: 'Pipeline Value by Stage',
        type: 'GRAPH',
        configurationType: 'BAR_CHART',
        position: { layoutMode: 'GRID', row: 0, column: 0, rowSpan: 6, columnSpan: 6 },
      },
      {
        title: 'Deals by Stage and Billing Type',
        type: 'GRAPH',
        configurationType: 'BAR_CHART',
        position: { layoutMode: 'GRID', row: 0, column: 6, rowSpan: 6, columnSpan: 6 },
      },
      {
        title: 'Open Deals Worklist',
        type: 'RECORD_TABLE',
        configurationType: 'RECORD_TABLE',
        position: { layoutMode: 'GRID', row: 6, column: 0, rowSpan: 6, columnSpan: 12 },
      },
      {
        title: 'Revenue by Billing Type',
        type: 'GRAPH',
        configurationType: 'BAR_CHART',
        position: { layoutMode: 'GRID', row: 0, column: 0, rowSpan: 6, columnSpan: 6 },
      },
      {
        title: 'Projects by Status',
        type: 'GRAPH',
        configurationType: 'PIE_CHART',
        position: { layoutMode: 'GRID', row: 0, column: 6, rowSpan: 6, columnSpan: 6 },
      },
      {
        title: 'Projects',
        type: 'RECORD_TABLE',
        configurationType: 'RECORD_TABLE',
        position: { layoutMode: 'GRID', row: 6, column: 0, rowSpan: 6, columnSpan: 12 },
      },
      {
        title: 'Overdue Follow-ups',
        type: 'RECORD_TABLE',
        configurationType: 'RECORD_TABLE',
        position: { layoutMode: 'GRID', row: 12, column: 0, rowSpan: 6, columnSpan: 12 },
      },
    ]);

    for (const widget of widgets) {
      expect(widget.objectUniversalIdentifier).toBeTruthy();
      const position = widget.position;

      if (!position) {
        throw new Error(`${widget.title} is missing its grid position.`);
      }

      expect(position.layoutMode).toBe('GRID');
      if (position.layoutMode === 'GRID') {
        expect(position.rowSpan).toBeGreaterThanOrEqual(2);
        expect(position.columnSpan).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('packages chart filters and worklist bindings with universal identifiers', () => {
    const widgets = (operationalDashboard.config.tabs ?? []).flatMap(
      (tab) => tab.widgets ?? [],
    );
    const widgetByTitle = (title: string) =>
      widgets.find((widget) => widget.title === title);

    expect(widgetByTitle('Current Revenue')?.configuration).toMatchObject({
      configurationType: 'AGGREGATE_CHART',
      aggregateOperation: 'SUM',
      prefix: '$',
      filter: {
        recordFilters: [{ operand: 'IS', value: '["ACTIVE"]' }],
        recordFilterGroups: [{ logicalOperator: 'AND' }],
      },
    });
    expect(widgetByTitle('Projected Revenue')?.configuration).toMatchObject({
      configurationType: 'AGGREGATE_CHART',
      aggregateOperation: 'SUM',
      filter: {
        recordFilters: [{ operand: 'IS_NOT', value: '["LOST","WON"]' }],
      },
    });
    expect(widgetByTitle('Open Deals')?.configuration).toMatchObject({
      configurationType: 'AGGREGATE_CHART',
      aggregateOperation: 'COUNT',
      filter: {
        recordFilters: [
          { operand: 'IS_NOT', value: '["PIPELINE","WON","LOST"]' },
        ],
      },
    });
    expect(widgetByTitle('Project Data Gaps')?.configuration).toMatchObject({
      configurationType: 'AGGREGATE_CHART',
      filter: {
        recordFilters: [
          { operand: 'IS_EMPTY', value: '' },
          { operand: 'IS_EMPTY', value: '' },
          { operand: 'IS_EMPTY', value: '', subFieldName: 'amountMicros' },
        ],
        recordFilterGroups: [{ logicalOperator: 'OR' }],
      },
    });
    expect(widgetByTitle('Open Deals Worklist')?.configuration).toEqual({
      configurationType: 'RECORD_TABLE',
      viewUniversalIdentifier: openDeals.config.universalIdentifier,
      recordLimit: 10,
    });
    expect(widgetByTitle('Projects')?.configuration).toMatchObject({
      configurationType: 'RECORD_TABLE',
      viewUniversalIdentifier: projectsList.config.universalIdentifier,
    });
    expect(widgetByTitle('Overdue Follow-ups')?.configuration).toEqual({
      configurationType: 'RECORD_TABLE',
      viewUniversalIdentifier: overdueFollowUps.config.universalIdentifier,
      recordLimit: 10,
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
