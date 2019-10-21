import { dateHelper } from './../controller/DateHelper';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_MODE_TYPE } from '../const/index';

export function getToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/** 根据不同的日期类型获取不同的格式 */
export function getFormat(dateMode: string, position?: string) {
  switch (dateMode) {
    case 'year':
      return 'YYYY';
    case 'month':
      if (position == 'top') return 'MMMM YYYY';
      else return 'MMMM';
    case 'week':
      if (position == 'top') return 'ww MMMM YYYY';
      else return 'ww';
    case 'dayweek':
      return 'MM-D';
    case 'daymonth':
      return 'D';
    default:
      return 'D';
  }
}

/** 获取某个开始的时间 */
export const getStartDate = (date, dateMode) => {
  let year;

  switch (dateMode) {
    case 'year':
      year = date.year();
      return dayjs()
        .set('year', year)
        .set('month', 0)
        .set('day', 1);
    case 'month':
      year = date.year();
      const month = date.month();
      return dayjs()
        .set('year', year)
        .set('month', month)
        .set('day', 1);
    case 'week':
      return dayjs(date).subtract(date.day(), 'day');
    default:
      return date;
  }
};

/** 获取某个模式的时间间隔 */
export function getModeIncrement(date: Dayjs, dateMode: DATE_MODE_TYPE) {
  switch (dateMode) {
    case 'year':
      return dateHelper.daysInYear(date.year());
    case 'month':
      return date.daysInMonth();
    case 'week':
      return 7;
    default:
      return 1;
  }
}
