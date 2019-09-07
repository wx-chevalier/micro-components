import { defaultConfig } from './../const/defaultConfig';
import { UiConfig } from './../types/index';

/** 配置中心 */
export class Config {
  data: UiConfig;

  constructor() {
    this.data = defaultConfig;
  }

  load = (values: any) => {
    this.data = {};
    if (values) this.populate(values, defaultConfig, this.data);
    else this.data = defaultConfig;
  };

  populate(values, defaultConfig, final) {
    if (!this.isObject(defaultConfig)) return;
    for (let key in defaultConfig) {
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
    return this.data;
  }
}

export const config = new Config();
