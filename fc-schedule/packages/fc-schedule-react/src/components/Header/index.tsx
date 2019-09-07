import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  BUFFER_DAYS,
  DATA_CONTAINER_WIDTH,
  DATE_MODE_DAY,
  DATE_MODE_WEEK,
  DATE_MODE_MONTH,
  DATE_MODE_YEAR
} from '@/const';

import { dateHelper } from '@/controller';

import './index.css';
import { HeaderItem } from './HeaderItem';
import { getFormat } from '@/utils/datetime';

export class Header extends PureComponent<any, any> {
  start: any;
  end: any;

  constructor(props) {
    super(props);
    this.setBoundaries();
  }

  getModeIncrement(date, dateMode) {
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

  getStartDate = (date, dateMode) => {
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
        return date.subtract(date.day(), 'days');
      default:
        return date;
    }
  };

  renderTime = (left, width, dateMode, key) => {
    const result: any[] = [];
    const hourWidth = width / 24;
    let iterLeft = 0;
    for (let i = 0; i < 24; i++) {
      result.push(
        <HeaderItem
          key={i}
          left={iterLeft}
          width={hourWidth}
          label={dateMode == 'shorttime' ? i : `${i}:00`}
        />
      );
      iterLeft = iterLeft + hourWidth;
    }
    return (
      <div key={key} style={{ position: 'absolute', height: 20, left: left, width: width }}>
        {' '}
        {result}
      </div>
    );
  };

  getBox(date, dateMode, lastLeft) {
    const increment = this.getModeIncrement(date, dateMode) * this.props.dayWidth;

    if (!lastLeft) {
      let starDate = this.getStartDate(date, dateMode);
      starDate = starDate.startOf('day');
      const now = moment().startOf('day');
      const daysInBetween = starDate.diff(now, 'days');

      lastLeft = dateHelper.dayToPosition(
        daysInBetween,
        this.props.nowPosition,
        this.props.dayWidth
      );
    }

    return { left: lastLeft, width: increment };
  }

  renderHeaderRows = (top, middle, bottom) => {
    const { config } = this.props;

    const result: any = { top: [], middle: [], bottom: [] };
    const lastLeft: any = {};
    let currentTop = '';
    let currentMiddle = '';
    let currentBottom = '';
    let currentDate: any = null;
    let box: any = null;

    const start = this.props.currentDay;
    const end = this.props.currentDay + this.props.numVisibleDays;

    for (let i = start - BUFFER_DAYS; i < end + BUFFER_DAYS; i++) {
      //The unit of iteration is day
      currentDate = moment().add(i, 'days');
      if (currentTop != currentDate.format(getFormat(top, 'top'))) {
        currentTop = currentDate.format(getFormat(top, 'top'));
        box = this.getBox(currentDate, top, lastLeft.top);
        lastLeft.top = box.left + box.width;
        result.top.push(
          <HeaderItem key={i} left={box.left} width={box.width} label={currentTop} />
        );
      }

      if (currentMiddle != currentDate.format(getFormat(middle))) {
        currentMiddle = currentDate.format(getFormat(middle));
        box = this.getBox(currentDate, middle, lastLeft.middle);
        lastLeft.middle = box.left + box.width;
        result.middle.push(
          <HeaderItem key={i} left={box.left} width={box.width} label={currentMiddle} />
        );
      }

      if (currentBottom != currentDate.format(getFormat(bottom))) {
        currentBottom = currentDate.format(getFormat(bottom));
        box = this.getBox(currentDate, bottom, lastLeft.bottom);
        lastLeft.bottom = box.left + box.width;
        if (bottom == 'shorttime' || bottom == 'fulltime') {
          result.bottom.push(this.renderTime(box.left, box.width, bottom, i));
        } else {
          result.bottom.push(
            <HeaderItem key={i} left={box.left} width={box.width} label={currentBottom} />
          );
        }
      }
    }

    return (
      <div
        className="timeLine-main-header-container"
        style={{ width: DATA_CONTAINER_WIDTH, maxWidth: DATA_CONTAINER_WIDTH }}
      >
        <div className="header-top" style={{ ...config.values.header.top.style }}>
          {result.top}
        </div>
        <div className="header-middle" style={{ ...config.values.header.middle.style }}>
          {result.middle}
        </div>
        <div className="header-bottom" style={{ ...config.values.header.bottom.style }}>
          {result.bottom}
        </div>
      </div>
    );
  };

  renderHeader = () => {
    switch (this.props.dateMode) {
      case DATE_MODE_DAY:
        return this.renderHeaderRows('week', 'dayweek', 'fulltime');
      case DATE_MODE_WEEK:
        return this.renderHeaderRows('week', 'dayweek', 'shorttime');
      case DATE_MODE_MONTH:
        return this.renderHeaderRows('month', 'dayweek', 'daymonth');
      case DATE_MODE_YEAR:
        return this.renderHeaderRows('year', 'month', 'week');
      default:
        return this.renderHeaderRows('year', 'month', 'week');
    }
  };

  setBoundaries = () => {
    this.start = this.props.currentDay - BUFFER_DAYS;
    this.end = this.props.currentDay + this.props.numVisibleDays + BUFFER_DAYS;
  };

  needToRender = () => {
    return (
      this.props.currentDay < this.start ||
      this.props.currentDay + this.props.numVisibleDays > this.end
    );
  };

  render() {
    if (this.refs.Header) {
      (this.refs.Header as any).scrollLeft = this.props.scrollLeft;
    }
    //Check boundaries to see if wee need to recalcualte header
    // if (this.needToRender()|| !this.cache){
    //     this.cache=this.renderHeader();
    //     this.setBoundaries();
    // }
    return (
      <div id="timeline-header" ref="Header" className="timeLine-main-header-viewPort">
        {this.renderHeader()}
      </div>
    );
  }
}
