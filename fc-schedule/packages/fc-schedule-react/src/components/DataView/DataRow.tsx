import React, { Component } from 'react';
import { UiConfig } from '../../types';

import withContext from '../../utils/context';

export interface IDataRowProps {
  children: React.ReactNode;
  itemHeight: number;
  left: number;
  top: number;

  label: string;
  config?: UiConfig;
}

export class DataRowComp extends Component<IDataRowProps> {
  constructor(props) {
    super(props);
  }
  render() {
    const { config = {} } = this.props;

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

export const DataRow = withContext<IDataRowProps>(DataRowComp);
