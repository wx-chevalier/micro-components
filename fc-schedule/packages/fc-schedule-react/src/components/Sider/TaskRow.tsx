import React, { Component } from 'react';

import { EditableText } from '../EditableText';

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
    const { config } = this.props;

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
