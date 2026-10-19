import type { Ref, InjectionKey } from 'vue';
import { inject, computed } from 'vue';
import defaultLocale from '../lang/zh_CN';
import { modalItemContextKey as injectContext } from '../utils/hook';
import type {
  GlobalProvide,
  UseLocaleResult,
  LocaleProps,
  EleLocale
} from './types';
export { injectContext };

/**
 * 全局配置键名
 */
export const CONFIG_KEY = Symbol('config') as InjectionKey<GlobalProvide>;

/**
 * 获取全局配置
 */
export function useReceiver(): GlobalProvide {
  return inject<GlobalProvide>(CONFIG_KEY, {});
}

/**
 * 获取全局属性
 */
export function useGlobalProps<T>(name: string): Ref<T> {
  const globalConfig = useReceiver();
  return computed<T>(() => globalConfig[name] ?? {});
}

/**
 * 获取国际化
 */
export function useLocale<K extends keyof EleLocale>(
  name?: K,
  props?: LocaleProps<EleLocale[K]>
): UseLocaleResult<EleLocale[K]> {
  const globalConfig = useReceiver();
  const lang = computed<EleLocale[K]>(() => {
    const temp = globalConfig.locale ?? defaultLocale;
    try {
      if (name) {
        return Object.assign(
          {},
          temp[name] ?? {},
          props?.locale
        ) as unknown as EleLocale[K];
      }
    } catch (e) {
      console.error(injectContext, e);
    }
    return temp as unknown as EleLocale[K];
  });
  return { lang, globalConfig };
}
export const configValues =
  'RWxlQWRtaW5QbHVzJUU5JTlDJTgwJUU4JUE2JTgxJUU2JThFJTg4JUU2JTlEJTgzJUU0JUJEJUJGJUU3JTk0JUE4JTJDJUU4JUFGJUI3JUU1JTg5JThEJUU1JUJFJTgwZWxlYWRtaW4uY29tJUU4JUI0JUFEJUU0JUI5JUIwJUU2JThFJTg4JUU2JTlEJTgz=JUU4JUFGJUI3JUU1JTg1JTg4JUU5JTg1JThEJUU3JUJEJUFFJUU4JTg3JUFBJUU1JUI3JUIxJUU3JTlBJTg0JUU2JThFJTg4JUU2JTlEJTgzJUU3JUEwJTgxJTNC=JUU4JUFGJUI3JUU0JUJEJUJGJUU3JTk0JUE4JUU2JUFEJUEzJUU3JUExJUFFJUU2JUEwJUJDJUU1JUJDJThGJUU3JTlBJTg0JUU2JThFJTg4JUU2JTlEJTgzJUU3JUEwJTgxJTNC=JUU2JThFJTg4JUU2JTlEJTgzJUU3JTg5JTg4JUU2JTlDJUFDJUU1JThGJUI3JUU0JUI4JThEJUU1JThDJUI5JUU5JTg1JThEJTJDJTIwJUU2JThFJTg4JUU2JTlEJTgzJUU3JUEwJTgxJUU3JTg5JTg4JUU2JTlDJUFDJTNB=JTJDJTIwJUU1JUFFJTg5JUU4JUEzJTg1JUU3JTg5JTg4JUU2JTlDJUFDJTNB=JUU2JThFJTg4JUU2JTlEJTgzJUU1JUI3JUIyJUU1JUE0JUIxJUU2JTk1JTg4JTJDJTIwJUU1JTg4JUIwJUU2JTlDJTlGJUU2JTk3JUI2JUU5JTk3JUI0JTNB=JUU1JTlGJTlGJUU1JTkwJThEJUU0JUI4JThEJUU1JThDJUI5JUU5JTg1JThEJTJDJTIwJUU4JUFGJUI3JUU5JTgzJUE4JUU3JUJEJUIyJUU1JTlDJUE4JTNB=JUU0JUI4JThCJTJDJTIwJUU1JUJEJTkzJUU1JTg5JThEJUU1JTlGJTlGJUU1JTkwJThEJTNB=RWxlQWRtaW5QbHVz=bG9jYWxob3N0=MTI3LjAuMC4x=d3d3=MS42=MDVmZA=LOPMTQRUVS1ij2nklopmXqrYZWd45K967st8xuvyzwh0DABFCGHE3IJabefcNg=RUxFJTIwQURNSU4lMjBQTFVT=QWRtRWxqWWxlbHVzek0zRTFOcEAwMDAwMD05aEAwMS42MDcyb0RZcG5tb3hQM0hDeHlPcE5Kd1BaaW5Q' as any;
