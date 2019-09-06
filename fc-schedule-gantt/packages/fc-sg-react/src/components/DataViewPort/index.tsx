import React, { Component } from 'react';
import { withSize } from 'react-sizeme';

import { DATA_CONTAINER_WIDTH } from '@/const';
import { dateHelper, config } from '@/controller';

import { DataTask } from './DataTask';

interface IProps {
  label: string;
  left: number;
  top: number;
  itemHeight: number;
}

export class DataRow extends Component<IProps> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className="timeLine-main-data-row"
        style={{
          ...config.values.dataViewPort.rows.style,
          top: this.props.top,
          height: this.props.itemHeight
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

interface IDataViewPortCompProps extends IProps {
  startRow: number;
  endRow: number;
  data: any;
  nowPosition: number;
  scrollLeft: number;
  scrollTop: number;
  dayWidth: number;
  selectedItem: any;

  onMouseDown: any;
  onMouseUp: any;
  onMouseMove: any;
  onMouseLeave: any;
  onTouchStart: any;
  onTouchMove: any;
  onTouchCancel: any;
  onTouchEnd: any;

  onTaskChanging: Function;
  onChildDrag: Function;
  onSelectItem: Function;
  onUpdateTask: Function;
  onStartCreateLink: Function;
  onFinishCreateLink: Function;
}

export class DataViewPortComp extends Component<IDataViewPortCompProps> {
  childDragging: boolean;

  constructor(props) {
    super(props);
    this.childDragging = false;
  }
  getContainerHeight(rows) {
    let new_height = rows > 0 ? rows * this.props.itemHeight : 10;
    return new_height;
  }
  onChildDrag = dragging => {
    this.childDragging = dragging;
  };

  renderRows = () => {
    let result: any[] = [];
    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      let item = this.props.data[i];
      if (!item) break;
      //FIXME PAINT IN BOUNDARIES

      let new_position = dateHelper.dateToPixel(
        item.start,
        this.props.nowPosition,
        this.props.dayWidth
      );
      let new_width =
        dateHelper.dateToPixel(item.end, this.props.nowPosition, this.props.dayWidth) -
        new_position;
      result.push(
        <DataRow
          key={i}
          label={item.name}
          top={i * this.props.itemHeight}
          left={20}
          itemHeight={this.props.itemHeight}
        >
          <DataTask
            item={item}
            label={item.name}
            nowPosition={this.props.nowPosition}
            dayWidth={this.props.dayWidth}
            color={item.color}
            left={new_position}
            width={new_width}
            height={this.props.itemHeight}
            onChildDrag={this.onChildDrag}
            isSelected={this.props.selectedItem == item}
            onSelectItem={this.props.onSelectItem}
            onStartCreateLink={this.props.onStartCreateLink}
            onFinishCreateLink={this.props.onFinishCreateLink}
            onTaskChanging={this.props.onTaskChanging}
            onUpdateTask={this.props.onUpdateTask}
          >
            {' '}
          </DataTask>
        </DataRow>
      );
    }
    return result;
  };

  doMouseDown = e => {
    if (e.button === 0 && !this.childDragging) {
      this.props.onMouseDown(e);
    }
  };
  doMouseMove = e => {
    this.props.onMouseMove(e, this.refs.dataViewPort);
  };

  doTouchStart = e => {
    if (!this.childDragging) {
      this.props.onTouchStart(e);
    }
  };
  doTouchMove = e => {
    this.props.onTouchMove(e, this.refs.dataViewPort);
  };

  componentDidMount() {
    (this.refs.dataViewPort as any).scrollLeft = 0;
  }

  render() {
    if (this.refs.dataViewPort) {
      (this.refs.dataViewPort as any).scrollLeft = this.props.scrollLeft;
      (this.refs.dataViewPort as any).scrollTop = this.props.scrollTop;
    }

    let height = this.getContainerHeight(this.props.data.length);
    return (
      <div
        ref="dataViewPort"
        id="timeLinedataViewPort"
        className="timeLine-main-data-viewPort"
        onMouseDown={this.doMouseDown}
        onMouseMove={this.doMouseMove}
        onMouseUp={this.props.onMouseUp}
        onMouseLeave={this.props.onMouseLeave}
        onTouchStart={this.doTouchStart}
        onTouchMove={this.doTouchMove}
        onTouchEnd={this.props.onTouchEnd}
        onTouchCancel={this.props.onTouchCancel}
      >
        <div
          className="timeLine-main-data-container"
          style={{ height: height, width: DATA_CONTAINER_WIDTH, maxWidth: DATA_CONTAINER_WIDTH }}
        >
          {this.renderRows()}
        </div>
      </div>
    );
  }
}

export const DataViewPort = withSize({ monitorWidth: true, monitorHeight: true })(DataViewPortComp);
