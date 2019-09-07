import React, { Component } from 'react';

import { config } from '@/controller';

export interface IDataRowProps {
  label: string;
  left: number;
  top: number;
  itemHeight: number;
}

export class DataRow extends Component<IDataRowProps> {
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
