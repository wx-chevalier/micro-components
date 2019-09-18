import React, { Component } from 'react';

import { dateHelper } from '../../controller';
import {
  MODE_NONE,
  MODE_MOVE,
  MOVE_RESIZE_LEFT,
  MOVE_RESIZE_RIGHT,
  LINK_POS_LEFT,
  LINK_POS_RIGHT
} from '../../const';
import withContext from '../../utils/context';
import { UiConfig } from '../../types/index';

interface IProps {
  label: string;
  left: number;
  width: number;
  height: number;
  item: any;
  nowPosition: number;
  dayWidth: number;
  isSelected: boolean;
  color: string;

  onTaskChanging: Function;
  onChildDrag: Function;
  onSelectItem: Function;
  onUpdateTask: Function;
  onStartCreateLink: Function;
  onFinishCreateLink: Function;

  config: UiConfig;
}

interface IState {
  dragging: boolean;
  left: number;
  width: number;
  dateMode: number;
}

export class DataTaskComp extends Component<IProps, IState> {
  draggingPosition: number;

  constructor(props) {
    super(props);
    this.calculateStyle = this.calculateStyle.bind(this);
    this.state = {
      dragging: false,
      left: this.props.left,
      width: this.props.width,
      dateMode: MODE_NONE
    };
  }

  onCreateLinkMouseDown = (e, position) => {
    if (e.button === 0) {
      e.stopPropagation();
      this.props.onStartCreateLink(this.props.item, position);
    }
  };
  onCreateLinkMouseUp = (e, position) => {
    e.stopPropagation();
    this.props.onFinishCreateLink(this.props.item, position);
  };
  onCreateLinkTouchStart = (e, position) => {
    e.stopPropagation();
    this.props.onStartCreateLink(this.props.item, position);
  };
  onCreateLinkTouchEnd = (e, position) => {
    e.stopPropagation();
    this.props.onFinishCreateLink(this.props.item, position);
  };

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.doMouseMove);
      document.addEventListener('mouseup', this.doMouseUp);
      document.addEventListener('touchmove', this.doTouchMove);
      document.addEventListener('touchend', this.doTouchEnd);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.doMouseMove);
      document.removeEventListener('mouseup', this.doMouseUp);
      document.removeEventListener('touchmove', this.doTouchMove);
      document.removeEventListener('touchend', this.doTouchEnd);
    }
  }

  dragStart(x, dateMode) {
    this.props.onChildDrag(true);
    this.draggingPosition = x;
    this.setState({
      dragging: true,
      dateMode: dateMode,
      left: this.props.left,
      width: this.props.width
    });
  }

  dragProcess(x) {
    const delta = this.draggingPosition - x;
    let newLeft = this.state.left;
    let newWidth = this.state.width;

    switch (this.state.dateMode) {
      case MODE_MOVE:
        newLeft = this.state.left - delta;
        break;
      case MOVE_RESIZE_LEFT:
        newLeft = this.state.left - delta;
        newWidth = this.state.width + delta;
        break;
      case MOVE_RESIZE_RIGHT:
        newWidth = this.state.width - delta;
        break;
    }
    //the coordinates need to be global
    const changeObj = {
      item: this.props.item,
      position: {
        start: newLeft - this.props.nowPosition,
        end: newLeft + newWidth - this.props.nowPosition
      }
    };
    this.props.onTaskChanging(changeObj);
    this.setState({ left: newLeft, width: newWidth });
    this.draggingPosition = x;
  }

  dragEnd() {
    this.props.onChildDrag(false);
    const newStartDate = dateHelper.pixelToDate(
      this.state.left,
      this.props.nowPosition,
      this.props.dayWidth
    );
    const newEndDate = dateHelper.pixelToDate(
      this.state.left + this.state.width,
      this.props.nowPosition,
      this.props.dayWidth
    );
    this.props.onUpdateTask(this.props.item, { start: newStartDate, end: newEndDate });
    this.setState({ dragging: false, dateMode: MODE_NONE });
  }

  doMouseDown = (e, dateMode) => {
    if (!this.props.onUpdateTask) return;
    if (e.button === 0) {
      e.stopPropagation();
      this.dragStart(e.clientX, dateMode);
    }
  };

  doMouseMove = e => {
    if (this.state.dragging) {
      e.stopPropagation();
      this.dragProcess(e.clientX);
    }
  };
  doMouseUp = () => {
    this.dragEnd();
  };

  doTouchStart = (e, dateMode) => {
    if (!this.props.onUpdateTask) return;
    console.log('start');
    e.stopPropagation();
    this.dragStart(e.touches[0].clientX, dateMode);
  };

  doTouchMove = e => {
    if (this.state.dragging) {
      console.log('move');
      e.stopPropagation();
      this.dragProcess(e.changedTouches[0].clientX);
    }
  };

  doTouchEnd = e => {
    console.log('end');
    this.dragEnd();
  };

  calculateStyle() {
    const { config } = this.props;

    const configStyle = this.props.isSelected
      ? config.values.dataViewPort.task.selectedStyle
      : config.values.dataViewPort.task.style;

    const backgroundColor = this.props.color ? this.props.color : configStyle.backgroundColor;

    const finalHeight = this.props.height > 25 ? 20 : this.props.height - 5;
    const top = (this.props.height - finalHeight) / 2;

    // 这里根据是否拖拽有不同的样式设置
    if (this.state.dragging) {
      return {
        ...configStyle,
        backgroundColor,
        left: this.state.left,
        width: this.state.width,
        height: finalHeight,
        top
      };
    } else {
      return {
        ...configStyle,
        backgroundColor,
        left: this.props.left,
        width: this.props.width,
        height: finalHeight,
        top
      };
    }
  }

  render() {
    const { config } = this.props;
    const style = this.calculateStyle();

    return (
      <div
        onMouseDown={e => this.doMouseDown(e, MODE_MOVE)}
        onTouchStart={e => this.doTouchStart(e, MODE_MOVE)}
        onClick={e => {
          this.props.onSelectItem(this.props.item);
        }}
        style={style}
      >
        <div
          className="timeLine-main-data-task-side"
          style={{ top: 0, left: -4, height: style.height }}
          onMouseDown={e => this.doMouseDown(e, MOVE_RESIZE_LEFT)}
          onTouchStart={e => this.doTouchStart(e, MOVE_RESIZE_LEFT)}
        >
          <div
            className="timeLine-main-data-task-side-linker"
            onMouseUp={e => this.onCreateLinkMouseUp(e, LINK_POS_LEFT)}
            onTouchEnd={e => this.onCreateLinkTouchEnd(e, LINK_POS_LEFT)}
          />
        </div>
        <div style={{ overflow: 'hidden' }}>
          {config.values.dataViewPort.task.showLabel ? this.props.item.name : ''}
        </div>
        <div
          className="timeLine-main-data-task-side"
          style={{ top: 0, left: style.width - 3, height: style.height }}
          onMouseDown={e => this.doMouseDown(e, MOVE_RESIZE_RIGHT)}
          onTouchStart={e => this.doTouchStart(e, MOVE_RESIZE_RIGHT)}
        >
          <div
            className="timeLine-main-data-task-side-linker"
            onMouseDown={e => this.onCreateLinkMouseDown(e, LINK_POS_RIGHT)}
            onTouchStart={e => this.onCreateLinkTouchStart(e, LINK_POS_RIGHT)}
          />
        </div>
      </div>
    );
  }
}

export const DataTask = withContext(DataTaskComp);
