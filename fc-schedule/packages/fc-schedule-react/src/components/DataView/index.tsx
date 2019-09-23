import React, { Component } from 'react';
import { withSize } from 'react-sizeme';

import { DATA_CONTAINER_WIDTH } from '../../const';
import { dateHelper } from '../../controller';

import { TaskClip } from './TaskClip';
import { IDataRowProps, DataRow } from './DataRow';
import { Task, TaskGroup, EditingTask } from '../../types';
import { LinkPos } from '../../types/index';

interface IDataViewCompProps extends IDataRowProps {
  complementalLeft: number;
  taskGroups: TaskGroup[];
  dayWidth: number;
  disableLink?: boolean;
  scrollLeft: number;
  scrollTop: number;
  selectedTask: any;
  // 竖直可视的行数范围
  startRow: number;
  endRow: number;

  onMouseDown: any;
  onMouseUp: any;
  onMouseMove: any;
  onMouseLeave: any;
  onTouchStart: any;
  onTouchMove: any;
  onTouchCancel: any;
  onTouchEnd: any;

  onTaskChanging: (et: EditingTask) => void;
  onTaskPopoverRender?: (task: Task) => React.ReactNode;
  onChildDrag: (v: boolean) => void;
  onSelectTask: (task: Task) => void;
  onUpdateTask: (task: Task, { start, end }: { start: Date; end: Date }) => void;
  onStartCreateLink: (task: Task, pos: LinkPos) => void;
  onFinishCreateLink: (task: Task, pos: LinkPos) => void;
}

export class DataViewComp extends Component<IDataViewCompProps> {
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
    const { disableLink, taskGroups } = this.props;

    const result: any[] = [];

    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      const taskGroup = taskGroups[i];

      if (!taskGroup) break;
      // FIXME PAINT IN BOUNDARIES

      result.push(
        <DataRow
          key={i}
          label={taskGroup.name || ''}
          top={i * this.props.itemHeight}
          left={20}
          itemHeight={this.props.itemHeight}
        >
          {taskGroup.tasks.map((task: Task) => {
            const newPosition = dateHelper.dateToPixel(
              task.start,
              this.props.complementalLeft,
              this.props.dayWidth
            );

            const newWidth =
              dateHelper.dateToPixel(task.end, this.props.complementalLeft, this.props.dayWidth) -
              newPosition;

            return (
              <TaskClip
                key={task.id}
                task={task}
                label={task.name || ''}
                complementalLeft={this.props.complementalLeft}
                color={task.color || ''}
                dayWidth={this.props.dayWidth}
                disableLink={disableLink}
                left={newPosition}
                width={newWidth}
                height={this.props.itemHeight}
                isSelected={this.props.selectedTask === task}
                onChildDrag={this.onChildDrag}
                onSelectTask={this.props.onSelectTask}
                onStartCreateLink={this.props.onStartCreateLink}
                onFinishCreateLink={this.props.onFinishCreateLink}
                onTaskChanging={this.props.onTaskChanging}
                onTaskPopoverRender={this.props.onTaskPopoverRender}
                onUpdateTask={this.props.onUpdateTask}
              />
            );
          })}
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
    this.props.onMouseMove(e, this.refs.DataView);
  };

  doTouchStart = e => {
    if (!this.childDragging) {
      this.props.onTouchStart(e);
    }
  };
  doTouchMove = e => {
    this.props.onTouchMove(e, this.refs.DataView);
  };

  componentDidMount() {
    (this.refs.DataView as any).scrollLeft = 0;
  }

  render() {
    if (this.refs.DataView) {
      (this.refs.DataView as any).scrollLeft = this.props.scrollLeft;
      (this.refs.DataView as any).scrollTop = this.props.scrollTop;
    }

    const height = this.getContainerHeight(this.props.taskGroups.length);

    return (
      <div
        ref="DataView"
        id="timeLineDataView"
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

export const DataView = withSize({ monitorWidth: true, monitorHeight: true })(DataViewComp);
