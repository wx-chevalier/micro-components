import React, { Component } from 'react';

import withContext from '../../utils/context';

import './index.less';
import { SiderRow } from './SiderRow';

export class SiderComp extends Component<any, any> {
  containerStyle: any;

  constructor(props) {
    super(props);
  }

  getContainerStyle(rows) {
    const newHeight = rows > 0 ? rows * this.props.itemHeight : 10;
    return { height: newHeight };
  }

  renderSiderRow(data) {
    const result: any = [];

    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      const item = data[i];

      if (!item) break;

      result.push(
        <SiderRow
          key={i}
          index={i}
          config={this.props.config}
          item={item}
          label={item.name}
          top={i * this.props.itemHeight}
          itemHeight={this.props.itemHeight}
          nonEditable={this.props.nonEditable}
          isSelected={this.props.selectedItem == item}
          onUpdateTask={this.props.onUpdateTask}
          onSelectTask={this.props.onSelectTask}
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
            {this.renderSiderRow(data)}
          </div>
        </div>
      </div>
    );
  }
}

export const Sider = withContext(SiderComp);
