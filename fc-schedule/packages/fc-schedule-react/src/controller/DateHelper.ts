const MIL_IN_HOUR = 1000 * 3600;

/** 数据辅助 */
export class DateHelper {
  dateToPixel(input, nowPosition, daywidth) {
    const nowDate = this.getToday(); //
    const inputTime = new Date(input);

    //Day light saving patch
    const lightSavingDiff =
      (inputTime.getTimezoneOffset() - nowDate.getTimezoneOffset()) * 60 * 1000;
    const timeDiff = inputTime.getTime() - nowDate.getTime() - lightSavingDiff;
    const pixelWeight = daywidth / 24; //Value in pixels of one hour
    return (timeDiff / MIL_IN_HOUR) * pixelWeight + nowPosition;
  }

  pixelToDate(position, nowPosition, daywidth) {
    const hoursInPixel = 24 / daywidth;
    const pixelsFromNow = position - nowPosition;
    const today = this.getToday();
    const milisecondsFromNow = today.getTime() + pixelsFromNow * hoursInPixel * MIL_IN_HOUR;
    const result = new Date(milisecondsFromNow);
    const lightSavingDiff = (result.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;
    result.setTime(result.getTime() + lightSavingDiff);
    return result;
  }

  getToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  monthDiff(start, end) {
    return Math.abs(
      end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear())
    );
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  dayToPosition = (day, now, dayWidth) => {
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
