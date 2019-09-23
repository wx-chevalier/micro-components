import { defaultConfig } from '../const/defaultConfig';

export interface UiConfigProps {
  showController: boolean;
  header: {
    top?: any;
    middle?: any;
    bottom?: any;
  };

  [key: string]: any;
}

/** 配置中心 */
export class UiConfig {
  config: UiConfigProps;

  constructor() {
    this.config = defaultConfig;
  }

  load = (values: any) => {
    if (values) {
      this.populate(values, defaultConfig, this.config);
    } else {
      this.config = defaultConfig;
    }
  };

  populate(values, defaultConfig, final) {
    if (!this.isObject(defaultConfig)) return;
    for (const key in defaultConfig) {
      if (!values[key]) {
        //if not exits
        final[key] = defaultConfig[key];
      } else {
        //if it does
        final[key] = values[key];
        this.populate(values[key], defaultConfig[key], final[key]);
      }
    }
  }

  isObject(value) {
    if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number')
      return false;
    return true;
  }

  get values() {
    return this.config;
  }
}
