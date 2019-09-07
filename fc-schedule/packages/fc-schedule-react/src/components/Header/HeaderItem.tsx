import React, { PureComponent } from 'react';

export class HeaderItem extends PureComponent<any> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderLeft: 'solid 1px white',
          position: 'absolute',
          height: 20,
          left: this.props.left,
          width: this.props.width
        }}
      >
        <div>{this.props.label}</div>
      </div>
    );
  }
}
