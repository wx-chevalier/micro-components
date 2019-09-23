import React, { Component } from 'react';

import { EditableText } from '../EditableText';
import { TaskGroup } from '../../types/index';
import { UiConfig } from '../../controller/UiConfig';

export interface ISiderRowProps {
  config: UiConfig;
  label: string;
  index: number;
  isSelected: boolean;
  itemHeight: number;
  nonEditable?: boolean;
  taskGroup: TaskGroup;
  top: number;
  onSelectTaskGroup?: (task: TaskGroup) => void;
  onUpdateTaskGroup?: (task: TaskGroup, newTask: Partial<TaskGroup>) => void;
}

export class SiderRow extends Component<ISiderRowProps, any> {
  constructor(props) {
    super(props);
  }

  onChange = value => {
    if (this.props.onUpdateTaskGroup) {
      this.props.onUpdateTaskGroup(this.props.taskGroup, { name: value });
    }
  };

  render() {
    const { config } = this.props;

    return (
      <div
        className="timeLine-side-task-row"
        style={{
          ...config.values.taskList.task.style,
          top: this.props.top,
          height: this.props.itemHeight
        }}
        onClick={e =>
          this.props.onSelectTaskGroup && this.props.onSelectTaskGroup(this.props.taskGroup)
        }
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
