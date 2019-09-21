export const MODE_NONE = 0;
export const MODE_MOVE = 1;
export const MOVE_RESIZE_LEFT = 2;
export const MOVE_RESIZE_RIGHT = 3;

export const BUFFER_DAYS = 5;

export const DATA_CONTAINER_WIDTH = 5000;

export const DATE_MODE_DAY = 'day';
export const DATE_MODE_WEEK = 'week';
export const DATE_MODE_MONTH = 'month';
export const DATE_MODE_YEAR = 'year';

export type DATE_MODE_TYPE =
  | typeof DATE_MODE_DAY
  | typeof DATE_MODE_WEEK
  | typeof DATE_MODE_MONTH
  | typeof DATE_MODE_YEAR;

// 头部长度
export const DAY_YEAR_MODE = 4;
export const DAY_MONTH_MODE = 24;
export const DAY_WEEK_MODE = 480; //each hour 20 px
export const HOUR_DAY_WEEK = 20;
export const DAY_DAY_MODE = 1440; //each hour 60 px
export const HOUR_DAY_DAY = 60;

/** 获取某天的宽度 */
export function getDayWidth(dateMode: DATE_MODE_TYPE = DATE_MODE_MONTH) {
  switch (dateMode) {
    case DATE_MODE_DAY:
      return DAY_DAY_MODE;
    case DATE_MODE_WEEK:
      return DAY_WEEK_MODE;
    case DATE_MODE_MONTH:
      return DAY_MONTH_MODE;
    case DATE_MODE_YEAR:
      return DAY_YEAR_MODE;
    default:
      return DAY_MONTH_MODE;
  }
}

export const LINK_POS_LEFT = undefined;
export const LINK_POS_RIGHT = undefined;
