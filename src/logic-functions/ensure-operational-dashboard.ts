import { CoreApiClient } from 'twenty-client-sdk/core';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import {
  definePostInstallLogicFunction,
  type InstallPayload,
} from 'twenty-sdk/define';

import {
  OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  OPERATIONAL_DASHBOARD_RECORD_ID,
  OPERATIONAL_DASHBOARD_TITLE,
} from 'src/constants/universal-identifiers';

const getOperationalDashboardLayoutId = async (): Promise<string> => {
  const metadataClient = new MetadataApiClient();
  const result = await metadataClient.query({
    getPageLayouts: {
      id: true,
      type: true,
      universalIdentifier: true,
    },
  });
  const layout = result.getPageLayouts.find(
    (candidate) =>
      candidate.universalIdentifier ===
        OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER &&
      candidate.type === 'DASHBOARD',
  );

  if (!layout) {
    throw new Error('The Operational dashboard page layout was not found after installation.');
  }

  return layout.id;
};

type GraphqlErrorWithCode = {
  extensions?: {
    code?: unknown;
  };
};

const isNotFoundError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object' || !('errors' in error)) {
    return false;
  }

  const errors = (error as { errors?: unknown }).errors;

  return (
    Array.isArray(errors) &&
    errors.length > 0 &&
    errors.every(
      (entry: unknown) =>
        Boolean(entry) &&
        typeof entry === 'object' &&
        (entry as GraphqlErrorWithCode).extensions?.code === 'NOT_FOUND',
    )
  );
};

export const ensureOperationalDashboard = async (
  _payload: InstallPayload,
): Promise<void> => {
  const pageLayoutId = await getOperationalDashboardLayoutId();
  const coreClient = new CoreApiClient();
  let dashboard:
    | {
        id: string;
        deletedAt?: string | null;
        pageLayoutId?: string | null;
        title?: string | null;
      }
    | undefined;

  try {
    const result = await coreClient.query({
      dashboard: {
        __args: {
          filter: {
            id: { eq: OPERATIONAL_DASHBOARD_RECORD_ID },
            or: [
              { deletedAt: { is: 'NULL' } },
              { deletedAt: { is: 'NOT_NULL' } },
            ],
          },
        },
        id: true,
        deletedAt: true,
        pageLayoutId: true,
        title: true,
      },
    });
    dashboard = result.dashboard ?? undefined;
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }

  if (!dashboard) {
    await coreClient.mutation({
      createDashboard: {
        __args: {
          data: {
            id: OPERATIONAL_DASHBOARD_RECORD_ID,
            pageLayoutId,
            title: OPERATIONAL_DASHBOARD_TITLE,
          },
        },
        id: true,
      },
    });
    return;
  }

  if (dashboard.deletedAt) {
    await coreClient.mutation({
      restoreDashboard: {
        __args: { id: dashboard.id },
        id: true,
      },
    });
  }

  if (
    dashboard.pageLayoutId === pageLayoutId &&
    dashboard.title === OPERATIONAL_DASHBOARD_TITLE
  ) {
    return;
  }

  await coreClient.mutation({
    updateDashboard: {
      __args: {
        id: dashboard.id,
        data: {
          pageLayoutId,
          title: OPERATIONAL_DASHBOARD_TITLE,
        },
      },
      id: true,
    },
  });
};

export default definePostInstallLogicFunction({
  universalIdentifier: '8913b0b0-294f-454d-946d-061f06ccbd5e',
  name: 'ensureOperationalDashboard',
  description: 'Ensures the Operational dashboard appears in Twenty dashboards.',
  timeoutSeconds: 30,
  shouldRunOnVersionUpgrade: true,
  shouldRunSynchronously: true,
  handler: ensureOperationalDashboard,
});
