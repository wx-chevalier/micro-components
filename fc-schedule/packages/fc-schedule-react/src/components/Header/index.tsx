import React, { PureComponent } from 'react';
import moment, { Moment } from 'moment';
import {
  BUFFER_DAYS,
  DATA_CONTAINER_WIDTH,
  DATE_MODE_DAY,
  DATE_MODE_WEEK,
  DATE_MODE_MONTH,
  DATE_MODE_YEAR
} from '../../const';

import { dateHelper } from '../../controller';

import './index.css';
import { HeaderItem } from './HeaderItem';
import { getFormat } from '../../utils/datetime';
import { getStartDate } from '../../utils/datetime';
import { DATE_MODE_TYPE } from '../../const/index';
import { UiConfig } from '../../types/index';

export interface IHeaderProps {
  // 当前开始的天
  currentDay: number;
  dayWidth: number;
  visibleDaysNum: number;
  // 当前时间的位置
  nowPosition: number;
  scrollLeft: number;
  dateMode: DATE_MODE_TYPE;

  config: UiConfig;
}

export interface IHeaderState {}

export class Header extends PureComponent<IHeaderProps, IHeaderState> {
  cache: any;

  // 具体的开始时间
  startDate: Moment;
  // 开始的日期下标，数字，开始的时间为 currentDay - BUFFER_DAYS
  startDay: number;
  // 结束时间为 currentDay + visibleDaysNum + BUFFER_DAYS
  endDay: number;

  constructor(props) {
    super(props);
    this.setBoundaries();
  }

  /** 获取某个模式的时间间隔 */
  getModeIncrement(date: Moment, dateMode) {
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

  setBoundaries = () => {
    this.startDay = this.props.currentDay - BUFFER_DAYS;
    this.endDay = this.props.currentDay + this.props.visibleDaysNum + BUFFER_DAYS;
  };

  renderTime = (left, width, dateMode, key, withYear) => {
    const result: any[] = [];
    const hourWidth = width / 24;
    let iterLeft = 0;

    for (let i = 0; i < 24; i++) {
      result.push(
        <HeaderItem
          key={`${key}-${i}`}
          left={iterLeft}
          width={hourWidth}
          label={dateMode == 'shorttime' ? i : `${i}:00`}
          height={withYear ? 20 : 30}
        />
      );
      iterLeft = iterLeft + hourWidth;
    }
    return (
      <div
        key={key}
        style={{ position: 'absolute', height: withYear ? 20 : 30, left: left, width: width }}
      >
        {result}
      </div>
    );
  };

  getBox(date: Moment, dateMode: DATE_MODE_TYPE, lastLeft: number) {
    const increment = this.getModeIncrement(date, dateMode) * this.props.dayWidth;
    let newLastLeft = lastLeft;

    if (!lastLeft) {
      const startDate = getStartDate(date, dateMode).startOf('day');
      const now = moment().startOf('day');
      const daysInBetween = startDate.diff(now, 'days');

      newLastLeft = dateHelper.dayToPosition(
        daysInBetween,
        this.props.nowPosition,
        this.props.dayWidth
      );
    }

    return { left: newLastLeft, width: increment };
  }

  renderHeaderRows = (top, middle, bottom, withYear = true) => {
    const { config } = this.props;

    const result: any = { top: [], middle: [], bottom: [] };
    const lastLeft: any = {};
    let currentTop = '';
    let currentMiddle = '';
    let currentBottom = '';

    let box: any = null;

    this.startDay = this.props.currentDay - BUFFER_DAYS;
    this.endDay = this.props.currentDay + this.props.visibleDaysNum + BUFFER_DAYS;

    this.startDate = moment().add(this.startDay, 'days');

    for (let i = this.startDay; i < this.endDay; i++) {
      // The unit of iteration is day
      const currentDate = moment().add(i, 'days');

      if (withYear && currentTop != currentDate.format(getFormat(top, 'top'))) {
        currentTop = currentDate.format(getFormat(top, 'top'));

        box = this.getBox(currentDate, top, lastLeft.top);

        lastLeft.top = box.left + box.width;

        result.top.push(
          <HeaderItem
            key={currentDate.valueOf()}
            left={box.left}
            width={box.width}
            label={currentTop}
          />
        );
      }

      if (currentMiddle != currentDate.format(getFormat(middle))) {
        currentMiddle = currentDate.format(getFormat(middle));
        box = this.getBox(currentDate, middle, lastLeft.middle);

        lastLeft.middle = box.left + box.width;

        result.middle.push(
          <HeaderItem
            key={currentDate.valueOf()}
            left={box.left}
            width={box.width}
            label={currentMiddle}
            height={withYear ? 20 : 30}
          />
        );
      }

      if (currentBottom != currentDate.format(getFormat(bottom))) {
        currentBottom = currentDate.format(getFormat(bottom));

        box = this.getBox(currentDate, bottom, lastLeft.bottom);

        lastLeft.bottom = box.left + box.width;

        if (bottom == 'shorttime' || bottom == 'fulltime') {
          result.bottom.push(
            this.renderTime(box.left, box.width, bottom, currentDate.valueOf(), withYear)
          );
        } else {
          result.bottom.push(
            <HeaderItem
              key={currentDate.valueOf()}
              left={box.left}
              width={box.width}
              label={currentBottom}
              height={withYear ? 20 : 30}
            />
          );
        }
      }
    }

    return (
      <div
        className="timeLine-main-header-container"
        style={{ width: DATA_CONTAINER_WIDTH, maxWidth: DATA_CONTAINER_WIDTH }}
      >
        {withYear && (
          <div className="header-top" style={{ ...config.values.header.top.style }}>
            {result.top}
          </div>
        )}
        <div
          className="header-middle"
          style={{ height: withYear ? 20 : 30, ...config.values.header.middle.style }}
        >
          {result.middle}
        </div>
        <div
          className="header-bottom"
          style={{ height: withYear ? 20 : 30, ...config.values.header.bottom.style }}
        >
          {result.bottom}
        </div>
      </div>
    );
  };

  renderHeader = () => {
    switch (this.props.dateMode) {
      case DATE_MODE_DAY:
        return this.renderHeaderRows('week', 'dayweek', 'fulltime', false);
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

  needToRender = () => {
    return (
      this.props.currentDay < this.startDay ||
      this.props.currentDay + this.props.visibleDaysNum > this.endDay
    );
  };

  render() {
    if (this.refs.headerRef) {
      (this.refs.headerRef as any).scrollLeft = this.props.scrollLeft;
    }
    // Check boundaries to see if wee need to recalcualte header
    if (this.needToRender() || !this.cache) {
      this.cache = this.renderHeader();
      this.setBoundaries();
    }

    return (
      <div id="timelineHeader" ref="headerRef" className="timeLine-main-header-viewPort">
        {this.renderHeader()}
      </div>
    );
  }
}
