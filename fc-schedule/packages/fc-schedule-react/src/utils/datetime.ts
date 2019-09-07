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
