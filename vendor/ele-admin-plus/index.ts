/** https://eleadmin.com */
import { installer } from './installer';

export * from './components';
export * from './core-export';
export * from './utils/theme-util';

export const install = installer.install;
export default installer;
