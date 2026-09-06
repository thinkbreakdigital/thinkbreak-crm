import { defineView, ViewType } from 'twenty-sdk/define';

const DEAL_STAGE_FIELD = 'bc9ce40a-1bd4-45cd-a391-b67dd59b3563';
const DEAL_PROBABILITY_FIELD = '28456522-dc92-42de-85c5-42313f24dd37';

export default defineView({
  universalIdentifier: '3cc2f458-c70b-4473-bc2b-69d4b3f8dbbe',
  name: 'Deals board',
  objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
  icon: 'IconLayoutKanban',
  position: 0,
  type: ViewType.KANBAN,
  mainGroupByFieldMetadataUniversalIdentifier: DEAL_STAGE_FIELD,
  fields: [
    {
      universalIdentifier: 'b4b8e0e5-efff-4f29-9c08-408b7e96e655',
      fieldMetadataUniversalIdentifier: DEAL_PROBABILITY_FIELD,
      position: 0,
    },
  ],
  groups: [
    { universalIdentifier: 'a95dc927-b409-43dc-8173-18f2054165a7', fieldValue: 'PIPELINE', position: 0 },
    { universalIdentifier: 'dd836b7d-f359-41ae-9ab2-d51ab816173d', fieldValue: 'OUTREACH', position: 1 },
    { universalIdentifier: 'f6096be7-eb3d-423e-9110-92c5a1198be3', fieldValue: 'APPT_SET', position: 2 },
    { universalIdentifier: 'd22b5b05-6e33-4eb0-8fbb-29a8286b6d7e', fieldValue: 'APPT_MET', position: 3 },
    { universalIdentifier: '0bd4ce8b-d9f4-407b-9da4-397b78c0bcfe', fieldValue: 'QUOTE', position: 4 },
    { universalIdentifier: 'e859fc61-ffab-45eb-9dd8-5a438261cb3a', fieldValue: 'WON', position: 5 },
    { universalIdentifier: '6d74fe97-a672-4161-81ad-81c5290888c5', fieldValue: 'LOST', position: 6 },
  ],
});
