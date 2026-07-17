import { getAppConfig, getStyles } from '$lib/server/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
  const config = await getAppConfig(request.headers);
  const styles = getStyles(config);
  return {
    pageTitle: config.pageTitle,
    pageDescription: config.pageDescription,
    companyName: config.companyName,
    logo: config.logo,
    logoDark: config.logoDark ?? config.logo,
    styles,
  };
};
