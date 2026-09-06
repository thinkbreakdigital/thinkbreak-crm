import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
  WidgetType,
} from 'twenty-sdk/define';

import { OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

const OPEN_DEALS_VIEW = '48120c6b-2448-4d91-83b3-11adc82a43fa';
const ACTIVE_PROJECTS_VIEW = '532b5e98-8ce9-46dd-9e78-53fe9f58e83b';
const OVERDUE_FOLLOW_UPS_VIEW = 'aea51fbe-767e-4dcd-97ad-964fa510a739';
const PROJECT_DATA_QUALITY_VIEW = 'eab1d547-2f91-4f8d-a555-3bf84d674dd9';

export default definePageLayout({
  universalIdentifier: OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Operational dashboard',
  type: PageLayoutType.DASHBOARD,
  tabs: [
    {
      universalIdentifier: 'b38f26fe-d6a2-4483-9f63-1f871569072e',
      title: 'Overview',
      position: 0,
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: '1b145e2f-dd15-43e5-a8a0-c388f72a92c1',
          title: 'Open Deals',
          type: WidgetType.RECORD_TABLE,
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 1,
            columnSpan: 1,
          },
          configuration: {
            configurationType: 'RECORD_TABLE',
            viewUniversalIdentifier: OPEN_DEALS_VIEW,
            recordLimit: 10,
          },
        },
        {
          universalIdentifier: '4e9cd6d2-c687-481e-970a-cdd01f48d574',
          title: 'Active Projects',
          type: WidgetType.RECORD_TABLE,
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 1,
            rowSpan: 1,
            columnSpan: 1,
          },
          configuration: {
            configurationType: 'RECORD_TABLE',
            viewUniversalIdentifier: ACTIVE_PROJECTS_VIEW,
            recordLimit: 10,
          },
        },
        {
          universalIdentifier: '9362c0bf-5d94-441f-9bd0-2e0f2a8de7c4',
          title: 'Overdue follow-ups',
          type: WidgetType.RECORD_TABLE,
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 1,
            column: 0,
            rowSpan: 1,
            columnSpan: 1,
          },
          configuration: {
            configurationType: 'RECORD_TABLE',
            viewUniversalIdentifier: OVERDUE_FOLLOW_UPS_VIEW,
            recordLimit: 10,
          },
        },
        {
          universalIdentifier: '35b659a8-69a3-49c2-8b44-edf8e451eb5b',
          title: 'Data quality',
          type: WidgetType.RECORD_TABLE,
          position: {
            layoutMode: PageLayoutTabLayoutMode.GRID,
            row: 1,
            column: 1,
            rowSpan: 1,
            columnSpan: 1,
          },
          configuration: {
            configurationType: 'RECORD_TABLE',
            viewUniversalIdentifier: PROJECT_DATA_QUALITY_VIEW,
            recordLimit: 10,
          },
        },
      ],
    },
  ],
});
