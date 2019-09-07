import React, { Component } from 'react';
import { withSize } from 'react-sizeme';

import { DATA_CONTAINER_WIDTH } from '@/const';
import { dateHelper } from '@/controller';

import { DataTask } from './TaskClip';
import { IDataRowProps, DataRow } from './DataRow';

interface IDataViewPortCompProps extends IDataRowProps {
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
    const newHeight = rows > 0 ? rows * this.props.itemHeight : 10;
    return newHeight;
  }
  onChildDrag = dragging => {
    this.childDragging = dragging;
  };

  renderRows = () => {
    const result: any[] = [];
    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      const item = this.props.data[i];
      if (!item) break;
      //FIXME PAINT IN BOUNDARIES

      const newPosition = dateHelper.dateToPixel(
        item.start,
        this.props.nowPosition,
        this.props.dayWidth
      );
      const newWidth =
        dateHelper.dateToPixel(item.end, this.props.nowPosition, this.props.dayWidth) - newPosition;

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
            left={newPosition}
            width={newWidth}
            height={this.props.itemHeight}
            onChildDrag={this.onChildDrag}
            isSelected={this.props.selectedItem == item}
            onSelectItem={this.props.onSelectItem}
            onStartCreateLink={this.props.onStartCreateLink}
            onFinishCreateLink={this.props.onFinishCreateLink}
            onTaskChanging={this.props.onTaskChanging}
            onUpdateTask={this.props.onUpdateTask}
          />
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

    const height = this.getContainerHeight(this.props.data.length);
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

export const DataView = withSize({ monitorWidth: true, monitorHeight: true })(DataViewPortComp);
