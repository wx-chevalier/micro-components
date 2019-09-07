import React, { Component } from 'react';
import { GanttTimeLine } from '../../src/components/GanttTimeLine';
import Generator from './Generator';
import './App.css';

export class AppFilter extends Component<any, any> {
  data: any;

  constructor(props) {
    super(props);
    let result = Generator.generateData();
    this.data = result.data;
    this.state = {
      itemHeight: 20,
      timeLineData: [],
      selectedItem: null,
      timelineMode: 'month',
      links: result.links
    };
  }

  onHorizonChange = (start, end) => {
    let result = this.data.filter(item => {
      return (
        (item.start < start && item.end > end) ||
        (item.start > start && item.start < end) ||
        (item.end > start && item.end < end)
      );
    });
    console.log('Calculating ');
    this.setState({ timeLineData: result });
  };

  render() {
    return (
      <div className="app-container">
        <div className="nav-container">
          <div className="dateMode-container-title">
            On Horizon Change Demo with client side Filtering
          </div>
        </div>
        <div className="time-line-container">
          <GanttTimeLine
            data={this.state.timeLineData}
            links={this.state.links}
            onHorizonChange={this.onHorizonChange}
            selectedItem={this.state.selectedItem}
          />
        </div>
      </div>
    );
  }
}
