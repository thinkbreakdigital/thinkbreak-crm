const API_URL = process.env.TWENTY_API_URL?.replace(/\/$/, '');
const API_KEY = process.env.TWENTY_API_KEY;

const DASHBOARD_ID = '9fc9c362-a362-4079-814d-268fcd9436c7';
const DASHBOARD_TITLE = 'Operational dashboard';
const PAGE_LAYOUT_UNIVERSAL_IDENTIFIER =
  'e6b870c6-4f89-4b4e-9d64-8b8c91a9202a';

if (!API_URL) {
  throw new Error('TWENTY_API_URL is not set.');
}

if (!API_KEY) {
  throw new Error('TWENTY_API_KEY is not set.');
}

const requestGraphql = async (path, query, { allowNotFound = false } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    redirect: 'error',
  });
  const responseText = await response.text();
  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(`${path} returned HTTP ${response.status} with invalid JSON.`);
  }

  const errors = result.errors ?? [];

  if (
    allowNotFound &&
    response.ok &&
    errors.length > 0 &&
    errors.every((error) => error.extensions?.code === 'NOT_FOUND')
  ) {
    return null;
  }

  if (!response.ok || errors.length > 0) {
    const details = errors
      ?.map((error) => {
        const code = error.extensions?.code;
        return code ? `${code}: ${error.message}` : error.message;
      })
      .join('; ');
    throw new Error(
      `${path} request failed with HTTP ${response.status}${details ? `: ${details}` : '.'}`,
    );
  }

  return result.data;
};

const metadata = await requestGraphql(
  '/metadata',
  `query ResolveOperationalDashboardLayout {
    getPageLayouts {
      id
      type
      universalIdentifier
    }
  }`,
);
const pageLayout = metadata.getPageLayouts.find(
  (candidate) =>
    candidate.universalIdentifier === PAGE_LAYOUT_UNIVERSAL_IDENTIFIER &&
    candidate.type === 'DASHBOARD',
);

if (!pageLayout) {
  throw new Error('The packaged Operational dashboard page layout was not found.');
}

const core = await requestGraphql(
  '/graphql',
  `query FindOperationalDashboard {
    dashboard(filter: { id: { eq: "${DASHBOARD_ID}" } }) {
      id
      pageLayoutId
      title
    }
  }`,
  { allowNotFound: true },
);
const dashboard = core?.dashboard;

if (!dashboard) {
  await requestGraphql(
    '/graphql',
    `mutation CreateOperationalDashboard {
      createDashboard(
        data: {
          id: "${DASHBOARD_ID}"
          pageLayoutId: "${pageLayout.id}"
          title: "${DASHBOARD_TITLE}"
        }
      ) {
        id
      }
    }`,
  );
  console.log('Created the Operational dashboard record.');
} else if (
  dashboard.pageLayoutId !== pageLayout.id ||
  dashboard.title !== DASHBOARD_TITLE
) {
  await requestGraphql(
    '/graphql',
    `mutation UpdateOperationalDashboard {
      updateDashboard(
        id: "${DASHBOARD_ID}"
        data: {
          pageLayoutId: "${pageLayout.id}"
          title: "${DASHBOARD_TITLE}"
        }
      ) {
        id
      }
    }`,
  );
  console.log('Repaired the Operational dashboard record.');
} else {
  console.log('The Operational dashboard record is already correct.');
}
