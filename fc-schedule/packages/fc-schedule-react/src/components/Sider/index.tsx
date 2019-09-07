import React, { Component } from 'react';

import withContext from '@/utils/context';

import './index.less';
import { TaskRow } from './TaskRow';

export class SiderComp extends Component<any, any> {
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
          config={this.props.config}
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
    const { config } = this.props;

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

export const Sider = withContext(SiderComp);
