import moment from 'moment';

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
  let year = null;

  switch (dateMode) {
    case 'year':
      year = date.year() as any;
      return moment([year, 0, 1] as any);
    case 'month':
      year = date.year();
      const month = date.month();
      return moment([year, month, 1]);
    case 'week':
      return moment(date).subtract(date.day(), 'days');
    default:
      return date;
  }
};
