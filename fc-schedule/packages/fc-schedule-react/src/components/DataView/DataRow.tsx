import React, { Component } from 'react';
import { UiConfig } from '../../types';

import withContext from '../../utils/context';

export interface IDataRowProps {
  label: string;
  left: number;
  top: number;
  itemHeight: number;

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

export const DataRow = withContext(DataRowComp);
