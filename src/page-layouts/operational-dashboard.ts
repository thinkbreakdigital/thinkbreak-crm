import {
  AggregateOperations,
  definePageLayout,
  getFieldUniversalIdentifier,
  ObjectRecordGroupByDateGranularity,
  PageLayoutTabLayoutMode,
  PageLayoutType,
  STANDARD_OBJECT,
  WidgetType,
} from 'twenty-sdk/define';

import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  OPERATIONAL_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const DEAL_OBJECT = 'cca977ba-ccd0-4734-892d-ae53118d9d34';
const DEAL_NAME_FIELD = '3c4b4a54-a187-437d-86b5-b7afc86292c5';
const DEAL_STAGE_FIELD = 'bc9ce40a-1bd4-45cd-a391-b67dd59b3563';
const DEAL_BILLING_TYPE_FIELD = 'd62cb047-c4be-409c-9d0a-c9c9a59fac11';
const DEAL_VALUE_FIELD = 'dc9c7c49-f860-4a47-a7ba-8723067fda5a';
const PROJECT_OBJECT = 'c3ad642e-8d67-491c-99c2-deddbe39f173';
const PROJECT_NAME_FIELD = '33391310-8078-48f2-ace9-2d41d6e75100';
const PROJECT_STATUS_FIELD = 'e00ad7cd-a0ae-47d3-87ca-79cc9f9f2a1d';
const PROJECT_BILLING_TYPE_FIELD = '3dd3080b-ef78-4602-b69c-86f1d5781f88';
const PROJECT_VALUE_FIELD = '7513009e-51dc-469b-990a-fd87c591a9ae';
const PROJECT_ANNUALIZED_VALUE_FIELD = '2a61fee5-e886-4351-a420-e5e271c7cd75';
const PROJECT_CREATED_AT_FIELD = getFieldUniversalIdentifier({
  applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: PROJECT_OBJECT,
  name: 'createdAt',
});
const COMPANY_INDUSTRY_FIELD = '6e2fde4a-eee5-4fb6-84fe-eaa5e1913398';
const OPEN_DEALS_VIEW = '48120c6b-2448-4d91-83b3-11adc82a43fa';
const PROJECTS_VIEW = 'c424e88e-c414-41e7-bcd6-37a8a4d6a701';
const OVERDUE_FOLLOW_UPS_VIEW = 'aea51fbe-767e-4dcd-97ad-964fa510a739';

const gridPosition = (
  row: number,
  column: number,
  rowSpan: number,
  columnSpan: number,
) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row,
  column,
  rowSpan,
  columnSpan,
});

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
          universalIdentifier: '4fcf0391-f3d1-468e-ba22-97ab828b1061',
          title: 'Deals by Stage',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: DEAL_OBJECT,
          position: gridPosition(0, 0, 6, 6),
          configuration: {
            configurationType: 'PIE_CHART',
            aggregateFieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
            dateGranularity: ObjectRecordGroupByDateGranularity.DAY,
            orderBy: 'FIELD_POSITION_ASC',
            displayDataLabel: true,
            displayLegend: true,
            showCenterMetric: true,
            hideEmptyCategory: false,
            splitMultiValueFields: true,
            color: 'auto',
          },
        },
        {
          universalIdentifier: 'b617f7d5-d7d8-447e-889a-882d995b37d5',
          title: 'Companies by Industry',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
          position: gridPosition(0, 6, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier:
              STANDARD_OBJECT.company.fields.name.universalIdentifier,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: COMPANY_INDUSTRY_FIELD,
            primaryAxisGroupBySubFieldName: 'name',
            primaryAxisDateGranularity: ObjectRecordGroupByDateGranularity.DAY,
            primaryAxisOrderBy: 'VALUE_DESC',
            omitNullValues: true,
            splitMultiValueFields: true,
            axisNameDisplay: 'NONE',
            displayDataLabel: true,
            displayLegend: true,
            layout: 'VERTICAL',
            isCumulative: false,
            color: 'auto',
          },
        },
        {
          universalIdentifier: '4e9cd6d2-c687-481e-970a-cdd01f48d574',
          title: 'Current Revenue',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: PROJECT_OBJECT,
          position: gridPosition(6, 0, 2, 3),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: PROJECT_ANNUALIZED_VALUE_FIELD,
            aggregateOperation: AggregateOperations.SUM,
            prefix: '$',
            numberFormat: 'FULL',
            filter: {
              recordFilters: [
                {
                  fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
                  operand: 'IS',
                  value: '["ACTIVE"]',
                  recordFilterGroupId: '479657ad-fb07-4bff-9bf9-27770ace28aa',
                },
              ],
              recordFilterGroups: [
                {
                  id: '479657ad-fb07-4bff-9bf9-27770ace28aa',
                  logicalOperator: 'AND',
                },
              ],
            },
          },
        },
        {
          universalIdentifier: 'ef049512-5fe5-4cc1-a324-749589056079',
          title: 'Projected Revenue',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: DEAL_OBJECT,
          position: gridPosition(6, 3, 2, 3),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: DEAL_VALUE_FIELD,
            aggregateOperation: AggregateOperations.SUM,
            prefix: '$',
            numberFormat: 'FULL',
            filter: {
              recordFilters: [
                {
                  fieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
                  operand: 'IS_NOT',
                  value: '["LOST","WON"]',
                  recordFilterGroupId: '9b67dbad-d473-4f68-ad53-a0013071382e',
                },
              ],
              recordFilterGroups: [
                {
                  id: '9b67dbad-d473-4f68-ad53-a0013071382e',
                  logicalOperator: 'AND',
                },
              ],
            },
          },
        },
        {
          universalIdentifier: '1b145e2f-dd15-43e5-a8a0-c388f72a92c1',
          title: 'Open Deals',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: DEAL_OBJECT,
          position: gridPosition(6, 6, 2, 3),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: DEAL_NAME_FIELD,
            aggregateOperation: AggregateOperations.COUNT,
            numberFormat: 'FULL',
            filter: {
              recordFilters: [
                {
                  fieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
                  operand: 'IS_NOT',
                  value: '["PIPELINE","WON","LOST"]',
                  recordFilterGroupId: '50de87f5-d0e0-4c8d-9593-2002abeddb22',
                },
              ],
              recordFilterGroups: [
                {
                  id: '50de87f5-d0e0-4c8d-9593-2002abeddb22',
                  logicalOperator: 'AND',
                },
              ],
            },
          },
        },
        {
          universalIdentifier: '35b659a8-69a3-49c2-8b44-edf8e451eb5b',
          title: 'Project Data Gaps',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: PROJECT_OBJECT,
          position: gridPosition(6, 9, 2, 3),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: PROJECT_NAME_FIELD,
            aggregateOperation: AggregateOperations.COUNT,
            numberFormat: 'FULL',
            filter: {
              recordFilters: [
                {
                  fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
                  operand: 'IS_EMPTY',
                  value: '',
                  recordFilterGroupId: '11b40c37-38c6-40e0-91fc-a53a9a6f2cb6',
                },
                {
                  fieldMetadataUniversalIdentifier: PROJECT_BILLING_TYPE_FIELD,
                  operand: 'IS_EMPTY',
                  value: '',
                  recordFilterGroupId: '11b40c37-38c6-40e0-91fc-a53a9a6f2cb6',
                },
                {
                  fieldMetadataUniversalIdentifier: PROJECT_VALUE_FIELD,
                  operand: 'IS_EMPTY',
                  value: '',
                  subFieldName: 'amountMicros',
                  recordFilterGroupId: '11b40c37-38c6-40e0-91fc-a53a9a6f2cb6',
                },
              ],
              recordFilterGroups: [
                {
                  id: '11b40c37-38c6-40e0-91fc-a53a9a6f2cb6',
                  logicalOperator: 'OR',
                },
              ],
            },
          },
        },
        {
          universalIdentifier: '0ca08aac-a354-4d71-8c0f-80cf7357990d',
          title: 'Revenue Trends',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: PROJECT_OBJECT,
          position: gridPosition(8, 0, 6, 12),
          configuration: {
            configurationType: 'LINE_CHART',
            aggregateFieldMetadataUniversalIdentifier: PROJECT_ANNUALIZED_VALUE_FIELD,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: PROJECT_CREATED_AT_FIELD,
            primaryAxisDateGranularity: ObjectRecordGroupByDateGranularity.MONTH,
            primaryAxisOrderBy: 'FIELD_ASC',
            omitNullValues: false,
            splitMultiValueFields: true,
            axisNameDisplay: 'NONE',
            displayDataLabel: true,
            displayLegend: true,
            numberFormat: 'FULL',
            isCumulative: true,
            color: 'auto',
          },
        },
      ],
    },
    {
      universalIdentifier: '513e5bc0-7c24-4551-823f-a3aee2d8a454',
      title: 'Pipeline',
      position: 1,
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: '1e40aaa5-5c82-4cfc-960a-73fa91193939',
          title: 'Pipeline Value by Stage',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: DEAL_OBJECT,
          position: gridPosition(0, 0, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: DEAL_VALUE_FIELD,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
            primaryAxisDateGranularity: ObjectRecordGroupByDateGranularity.DAY,
            primaryAxisOrderBy: 'FIELD_POSITION_DESC',
            omitNullValues: false,
            splitMultiValueFields: true,
            axisNameDisplay: 'NONE',
            displayDataLabel: true,
            displayLegend: true,
            numberFormat: 'SHORT',
            groupMode: 'STACKED',
            layout: 'HORIZONTAL',
            isCumulative: false,
            color: 'auto',
          },
        },
        {
          universalIdentifier: 'e0aabb65-25d9-4994-8990-43a9df65f2e8',
          title: 'Deals by Stage and Billing Type',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: DEAL_OBJECT,
          position: gridPosition(0, 6, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: DEAL_BILLING_TYPE_FIELD,
            primaryAxisDateGranularity: ObjectRecordGroupByDateGranularity.DAY,
            primaryAxisOrderBy: 'FIELD_POSITION_ASC',
            secondaryAxisGroupByFieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
            secondaryAxisGroupByDateGranularity: ObjectRecordGroupByDateGranularity.DAY,
            secondaryAxisOrderBy: 'FIELD_POSITION_ASC',
            omitNullValues: false,
            splitMultiValueFields: true,
            axisNameDisplay: 'NONE',
            displayDataLabel: true,
            displayLegend: true,
            numberFormat: 'FULL',
            groupMode: 'STACKED',
            layout: 'VERTICAL',
            isCumulative: false,
            color: 'auto',
          },
        },
        {
          universalIdentifier: 'e12797e6-8482-47fb-9f0e-f3c04794fd71',
          title: 'Open Deals Worklist',
          type: WidgetType.RECORD_TABLE,
          objectUniversalIdentifier: DEAL_OBJECT,
          position: gridPosition(6, 0, 6, 12),
          configuration: {
            configurationType: 'RECORD_TABLE',
            viewUniversalIdentifier: OPEN_DEALS_VIEW,
            recordLimit: 10,
          },
        },
      ],
    },
    {
      universalIdentifier: '5421481d-5b3f-4639-8f05-2d851309dce1',
      title: 'Operations',
      position: 2,
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: '817a5296-87a1-47bd-9757-4ad6b84660af',
          title: 'Revenue by Billing Type',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: PROJECT_OBJECT,
          position: gridPosition(0, 0, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: PROJECT_ANNUALIZED_VALUE_FIELD,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: PROJECT_BILLING_TYPE_FIELD,
            primaryAxisDateGranularity: ObjectRecordGroupByDateGranularity.DAY,
            primaryAxisOrderBy: 'FIELD_POSITION_ASC',
            omitNullValues: false,
            splitMultiValueFields: true,
            axisNameDisplay: 'NONE',
            displayDataLabel: true,
            displayLegend: true,
            numberFormat: 'FULL',
            groupMode: 'STACKED',
            layout: 'VERTICAL',
            isCumulative: false,
            color: 'auto',
            filter: {
              recordFilters: [
                {
                  fieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
                  operand: 'IS',
                  value: '["ACTIVE"]',
                  recordFilterGroupId: '7b1731e7-2bbe-4b9f-99a0-219691ae4a09',
                },
              ],
              recordFilterGroups: [
                {
                  id: '7b1731e7-2bbe-4b9f-99a0-219691ae4a09',
                  logicalOperator: 'AND',
                },
              ],
            },
          },
        },
        {
          universalIdentifier: '7e122d22-45b6-4aaf-8cdd-53b34fa21b01',
          title: 'Projects by Status',
          type: WidgetType.GRAPH,
          objectUniversalIdentifier: PROJECT_OBJECT,
          position: gridPosition(0, 6, 6, 6),
          configuration: {
            configurationType: 'PIE_CHART',
            aggregateFieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: PROJECT_STATUS_FIELD,
            dateGranularity: ObjectRecordGroupByDateGranularity.DAY,
            orderBy: 'FIELD_POSITION_ASC',
            displayDataLabel: true,
            displayLegend: true,
            showCenterMetric: true,
            hideEmptyCategory: false,
            splitMultiValueFields: true,
            color: 'auto',
          },
        },
        {
          universalIdentifier: 'e9393ade-1afa-4ff9-9573-91c2e46b0073',
          title: 'Projects',
          type: WidgetType.RECORD_TABLE,
          objectUniversalIdentifier: PROJECT_OBJECT,
          position: gridPosition(6, 0, 6, 12),
          configuration: {
            configurationType: 'RECORD_TABLE',
            viewUniversalIdentifier: PROJECTS_VIEW,
            recordLimit: 10,
          },
        },
        {
          universalIdentifier: '9362c0bf-5d94-441f-9bd0-2e0f2a8de7c4',
          title: 'Overdue Follow-ups',
          type: WidgetType.RECORD_TABLE,
          objectUniversalIdentifier: STANDARD_OBJECT.task.universalIdentifier,
          position: gridPosition(12, 0, 6, 12),
          configuration: {
            configurationType: 'RECORD_TABLE',
            viewUniversalIdentifier: OVERDUE_FOLLOW_UPS_VIEW,
            recordLimit: 10,
          },
        },
      ],
    },
  ],
});
