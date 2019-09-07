import React, { Component } from 'react';

import { config } from '@/controller';

import './index.less';
import { EditableText } from '../EditableText';

export class VerticalLine extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="timeLine-main-data-verticalLine" style={{ left: this.props.left }} />;
  }
}

export class TaskRow extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  onChange = value => {
    if (this.props.onUpdateTask) {
      this.props.onUpdateTask(this.props.item, { name: value });
    }
  };

  render() {
    return (
      <div
        className="timeLine-side-task-row"
        style={{
          ...config.values.taskList.task.style,
          top: this.props.top,
          height: this.props.itemHeight
        }}
        onClick={e => this.props.onSelectItem(this.props.item)}
      >
        {this.props.nonEditable ? (
          <div tabIndex={this.props.index} style={{ width: '100%' }}>
            {this.props.label}
          </div>
        ) : (
          <EditableText
            value={this.props.label}
            index={this.props.index}
            onChange={this.onChange}
          />
        )}
      </div>
    );
  }
}

export default class TaskList extends Component<any, any> {
  containerStyle: any;

  constructor(props) {
    super(props);
  }

  getContainerStyle(rows) {
    const newHeight = rows > 0 ? rows * this.props.itemHeight : 10;
    return { height: newHeight };
  }

  renderTaskRow(data) {
    const result: any = [];

    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      const item = data[i];

      if (!item) break;

      result.push(
        <TaskRow
          key={i}
          index={i}
          item={item}
          label={item.name}
          top={i * this.props.itemHeight}
          itemHeight={this.props.itemHeight}
          isSelected={this.props.selectedItem == item}
          onUpdateTask={this.props.onUpdateTask}
          onSelectItem={this.props.onSelectItem}
          nonEditable={this.props.nonEditable}
        />
      );
    }
    return result;
  }

  doScroll = () => {
    this.props.onScroll((this.refs.taskViewPort as any).scrollTop);
  };

  render() {
    const data = this.props.data ? this.props.data : [];

    this.containerStyle = this.getContainerStyle(data.length);

    return (
      <div className="timeLine-side">
        <div className="timeLine-side-title" style={config.values.taskList.title.style}>
          <div>{config.values.taskList.title.label}</div>
        </div>
        <div ref="taskViewPort" className="timeLine-side-task-viewPort" onScroll={this.doScroll}>
          <div className="timeLine-side-task-container" style={this.containerStyle}>
            {this.renderTaskRow(data)}
          </div>
        </div>
      </div>
    );
  }
}
