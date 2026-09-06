import { defineApplicationRole } from 'twenty-sdk/define';

import {
  APP_DISPLAY_NAME,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplicationRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: `${APP_DISPLAY_NAME} default function role`,
  description: `${APP_DISPLAY_NAME} default function role`,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    {
      objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  ],
  fieldPermissions: [
    {
      objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
      fieldUniversalIdentifier: '3dd3080b-ef78-4602-b69c-86f1d5781f88',
      canReadFieldValue: true,
      canUpdateFieldValue: false,
    },
    {
      objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
      fieldUniversalIdentifier: '7513009e-51dc-469b-990a-fd87c591a9ae',
      canReadFieldValue: true,
      canUpdateFieldValue: false,
    },
    {
      objectUniversalIdentifier: 'c3ad642e-8d67-491c-99c2-deddbe39f173',
      fieldUniversalIdentifier: '2a61fee5-e886-4351-a420-e5e271c7cd75',
      canReadFieldValue: true,
      canUpdateFieldValue: true,
    },
    {
      objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
      fieldUniversalIdentifier: 'bc9ce40a-1bd4-45cd-a391-b67dd59b3563',
      canReadFieldValue: true,
      canUpdateFieldValue: false,
    },
    {
      objectUniversalIdentifier: 'cca977ba-ccd0-4734-892d-ae53118d9d34',
      fieldUniversalIdentifier: '28456522-dc92-42de-85c5-42313f24dd37',
      canReadFieldValue: true,
      canUpdateFieldValue: true,
    },
  ],
});
