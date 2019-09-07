import React, { Component } from 'react';
import { GanttTimeLine, Task } from '../../src';

import './App.css';

export default class AppSimple extends Component<any, any> {
  data: Task[];
  links: any;

  constructor(props) {
    super(props);
    let d1 = new Date();
    let d2 = new Date();

    d2.setHours(d2.getHours() + 5);

    let d3 = new Date();
    d3.setHours(d3.getHours() + 8);

    let d4 = new Date();
    d4.setHours(d4.getHours() + 20);

    this.data = [
      { id: '1', start: d1, end: d2, name: 'Demo Task 1' },
      {
        id: '2',
        start: d3,
        end: d4,
        name: 'Demo Task 2'
      }
    ];
    this.links = [{ id: 1, start: 1, end: 2 }];
  }

  render() {
    return (
      <div className="app-container">
        <div className="time-line-container">
          <GanttTimeLine
            config={{
              taskList: {
                title: {
                  style: {
                    opacity: 0
                  }
                },
                task: {
                  style: {
                    backgroundColor: 'white'
                  }
                }
              }
            }}
            data={this.data}
            links={this.links}
          />
        </div>
      </div>
    );
  }
}
