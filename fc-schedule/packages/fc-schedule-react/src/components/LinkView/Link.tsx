import React, { Component } from 'react';
import withContext from '../../utils/context';

const SSHAPE_SIDE_WIDTH = 20;

export class LinkComp extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  calcNormCoordinates = () => {
    let cpt1 = { x: 0, y: 0 };
    let cpt2 = { x: 0, y: 0 };
    let middle = 0;
    middle = this.props.start.x + (this.props.end.x - this.props.start.x) / 2;
    cpt1 = { x: middle, y: this.props.start.y };
    cpt2 = { x: middle, y: this.props.end.y };
    return { cpt1: cpt1, cpt2: cpt2 };
  };

  calcSCoordinates = () => {
    const cpt1 = { x: this.props.start.x + SSHAPE_SIDE_WIDTH, y: this.props.start.y };
    const halfY = (this.props.end.y - this.props.start.y) / 2;
    const cpt2 = { x: cpt1.x, y: cpt1.y + halfY };
    const cpt3 = { x: this.props.end.x - SSHAPE_SIDE_WIDTH, y: cpt2.y };
    const cpt4 = { x: cpt3.x, y: cpt3.y + halfY };
    return { cpt1: cpt1, cpt2: cpt2, cpt3: cpt3, cpt4: cpt4 };
  };

  getPath = () => {
    let coordinates: any = null;
    if (this.props.start.x > this.props.end.x) {
      coordinates = this.calcSCoordinates();
      return `M${this.props.start.x} ${this.props.start.y}  ${coordinates.cpt1.x} ${coordinates.cpt1.y} ${coordinates.cpt2.x} ${coordinates.cpt2.y} ${coordinates.cpt3.x} ${coordinates.cpt3.y} ${coordinates.cpt4.x} ${coordinates.cpt4.y} ${this.props.end.x} ${this.props.end.y}`;
    } else {
      coordinates = this.calcNormCoordinates();
      return `M${this.props.start.x} ${this.props.start.y}  ${coordinates.cpt1.x} ${coordinates.cpt1.y} ${coordinates.cpt2.x} ${coordinates.cpt2.y} ${this.props.end.x} ${this.props.end.y}`;
    }
  };

  onSelect = e => {
    if (this.props.onSelectItem) this.props.onSelectItem(this.props.item);
  };

  render() {
    const { config } = this.props;

    console.log(config);
    const pathColor = this.props.isSelected
      ? config.values.links.selectedColor
      : config.values.links.color;
    return (
      <g className="timeline-link">
        <path
          pointerEvents="stroke"
          onMouseDown={this.onSelect}
          stroke="white"
          d={this.getPath()}
          strokeLinejoin="round"
          fill="transparent"
          strokeWidth="4"
          cursor="pointer"
        />

        <path
          pointerEvents="stroke"
          onMouseDown={this.onSelect}
          stroke={pathColor}
          d={this.getPath()}
          strokeLinejoin="round"
          fill="transparent"
          strokeWidth="1"
          cursor="pointer"
          markerEnd="url(#arrow)"
        />

        {/* <circle cx={this.props.start.x} 
                    cy={this.props.start.y} r="3" fill='white'  
                    stroke={pathColor} strokeWidth="1" />     */}
      </g>
    );
  }
}

export const Link = withContext(LinkComp);
