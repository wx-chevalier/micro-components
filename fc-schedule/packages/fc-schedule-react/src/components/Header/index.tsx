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
import { getFormat, getModeIncrement } from '../../utils/datetime';
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

  setBoundaries = () => {
    this.startDay = this.props.currentDay - BUFFER_DAYS;
    this.endDay = this.props.currentDay + this.props.visibleDaysNum + BUFFER_DAYS;
  };

  // 判断是否需要重新渲染
  shouldRerender = () => {
    return (
      this.props.currentDay < this.startDay ||
      this.props.currentDay + this.props.visibleDaysNum > this.endDay
    );
  };

  /** 获取到 Box */
  getBox(date: Moment, dateMode: DATE_MODE_TYPE, lastLeft: number) {
    const increment = getModeIncrement(date, dateMode) * this.props.dayWidth;
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

  /** 渲染时间 */
  renderTime = (left, width, dateMode, key, height: number) => {
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
          height={height}
        />
      );
      iterLeft = iterLeft + hourWidth;
    }
    return (
      <div key={key} style={{ position: 'absolute', height, left: left, width: width }}>
        {result}
      </div>
    );
  };

  /**
   * Render Header Rows
   */
  renderHeaderRows = (top, middle, bottom) => {
    const { config } = this.props;

    const height = top ? 20 : 30;
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

      if (top && currentTop != currentDate.format(getFormat(top, 'top'))) {
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
            height={height}
          />
        );
      }

      if (currentBottom != currentDate.format(getFormat(bottom))) {
        currentBottom = currentDate.format(getFormat(bottom));

        box = this.getBox(currentDate, bottom, lastLeft.bottom);

        lastLeft.bottom = box.left + box.width;

        if (bottom === 'shorttime' || bottom === 'fulltime') {
          result.bottom.push(
            this.renderTime(box.left, box.width, bottom, currentDate.valueOf(), height)
          );
        } else {
          result.bottom.push(
            <HeaderItem
              key={currentDate.valueOf()}
              left={box.left}
              width={box.width}
              label={currentBottom}
              height={height}
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
        {top && (
          <div className="header-top" style={{ ...config.values.header.top.style }}>
            {result.top}
          </div>
        )}
        <div className="header-middle" style={{ height, ...config.values.header.middle.style }}>
          {result.middle}
        </div>
        <div className="header-bottom" style={{ height, ...config.values.header.bottom.style }}>
          {result.bottom}
        </div>
      </div>
    );
  };

  renderHeader = () => {
    switch (this.props.dateMode) {
      case DATE_MODE_DAY:
        return this.renderHeaderRows(null, 'dayweek', 'fulltime');
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

  render() {
    if (this.refs.headerRef) {
      (this.refs.headerRef as any).scrollLeft = this.props.scrollLeft;
    }

    // Check boundaries to see if wee need to recalcualte header
    if (this.shouldRerender() || !this.cache) {
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
