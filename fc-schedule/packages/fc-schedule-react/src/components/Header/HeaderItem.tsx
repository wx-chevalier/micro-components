import React, { PureComponent } from 'react';

export interface IHeaderItemProps {
  left: number;
  width: number;
  label: string | number;

  height?: number;
}

export class HeaderItem extends PureComponent<IHeaderItemProps> {
  static defaultProps = {
    height: 20
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { height } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderLeft: 'solid 1px white',
          position: 'absolute',
          height,
          left: this.props.left,
          width: this.props.width
        }}
      >
        <div>{this.props.label}</div>
      </div>
    );
  }
}
