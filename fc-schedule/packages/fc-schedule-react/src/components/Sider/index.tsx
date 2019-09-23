import React, { Component } from 'react';

import './index.less';
import { SiderRow } from './SiderRow';
import withContext from '../../utils/context';
import { TaskGroup } from '../../types';
import { UiConfig } from '../../controller/UiConfig';

export interface ISiderProps {
  config?: UiConfig;
  endRow: number;
  itemHeight: number;
  nonEditable?: boolean;
  startRow: number;
  taskGroups: TaskGroup[];
  selectedTaskGroup?: TaskGroup;

  onScroll: Function;
  onSelectTaskGroup?: (task: TaskGroup) => void;
  onUpdateTaskGroup?: (task: TaskGroup, newTask: Partial<TaskGroup>) => void;
}

export class SiderComp extends Component<ISiderProps, any> {
  containerStyle: any;

  constructor(props) {
    super(props);
  }

  getContainerStyle(rows) {
    const newHeight = rows > 0 ? rows * this.props.itemHeight : 10;
    return { height: newHeight };
  }

  renderSiderRow(data) {
    const { config } = this.props;
    if (!config) {
      return;
    }
    const result: any = [];

    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      const item = data[i];

      if (!item) break;

      result.push(
        <SiderRow
          key={i}
          index={i}
          config={config}
          taskGroup={item}
          label={item.name}
          top={i * this.props.itemHeight}
          itemHeight={this.props.itemHeight}
          nonEditable={this.props.nonEditable}
          isSelected={this.props.selectedTaskGroup == item}
          onUpdateTaskGroup={this.props.onUpdateTaskGroup}
          onSelectTaskGroup={this.props.onSelectTaskGroup}
        />
      );
    }
    return result;
  }

  doScroll = () => {
    this.props.onScroll((this.refs.taskViewPort as any).scrollTop);
  };

  render() {
    const { config, taskGroups } = this.props;

    if (!config) {
      return;
    }

    this.containerStyle = this.getContainerStyle(taskGroups.length);

    return (
      <div className="timeLine-side">
        <div className="timeLine-side-title" style={config.values.taskList.title.style}>
          <div>{config.values.taskList.title.label}</div>
        </div>
        <div ref="taskViewPort" className="timeLine-side-task-viewPort" onScroll={this.doScroll}>
          <div className="timeLine-side-task-container" style={this.containerStyle}>
            {this.renderSiderRow(taskGroups)}
          </div>
        </div>
      </div>
    );
  }
}

export const Sider = withContext<ISiderProps>(SiderComp);
