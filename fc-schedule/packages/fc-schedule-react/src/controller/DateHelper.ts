import { getToday } from '../utils/datetime';

const MIL_IN_HOUR = 1000 * 3600;

/** 数据辅助 */
export class DateHelper {
  /** 以当前天 0 点为时间轴起点，计算相对的偏移 */
  dateToPixel(input, complementalLeft, dayWidth) {
    const nowDate = getToday();
    const inputTime = new Date(input);

    // Day light saving patch
    const lightSavingDiff =
      (inputTime.getTimezoneOffset() - nowDate.getTimezoneOffset()) * 60 * 1000;
    const timeDiff = inputTime.getTime() - nowDate.getTime() - lightSavingDiff;
    const pixelWeight = dayWidth / 24; //Value in pixels of one hour
    return (timeDiff / MIL_IN_HOUR) * pixelWeight + complementalLeft;
  }

  pixelToDate(position, complementalLeft, dayWidth) {
    const hoursInPixel = 24 / dayWidth;
    const pixelsFromNow = position - complementalLeft;
    const today = getToday();
    const milisecondsFromNow = today.getTime() + pixelsFromNow * hoursInPixel * MIL_IN_HOUR;
    const result = new Date(milisecondsFromNow);
    const lightSavingDiff = (result.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;

    result.setTime(result.getTime() + lightSavingDiff);

    return result;
  }

  monthDiff(start, end) {
    return Math.abs(
      end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear())
    );
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  /** 将日期转化为坐标轴 */
  dayToPosition = (day: number, now: number, dayWidth: number) => {
    return day * dayWidth + now;
  };

  daysInYear = year => {
    return this.isLeapYear(year) ? 366 : 365;
  };

  isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  }
}

export const dateHelper = new DateHelper();
