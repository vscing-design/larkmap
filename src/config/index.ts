import { getAppEnvConfig } from '@/utils/env';

const {
  VITE_APP_TITLE,
  VITE_API_URL,
  VITE_APP_SHORT_NAME,
  VITE_API_URL_PREFIX,
  VITE_UPLOAD_URL,
  VITE_APP_STORE_KEY,
  VITE_APP_ROUTE_MODE,
} = getAppEnvConfig();

if (!/[a-zA-Z\_]*/.test(VITE_APP_SHORT_NAME)) {
  console.warn(
    `VITE_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
  );
}

export default {
  title: VITE_APP_TITLE,
  apiUrl: VITE_API_URL,
  shortName: VITE_APP_SHORT_NAME,
  urlPrefix: VITE_API_URL_PREFIX,
  uploadUrl: VITE_UPLOAD_URL,
  storeKey: VITE_APP_STORE_KEY,
  routeMode: VITE_APP_ROUTE_MODE,
};
