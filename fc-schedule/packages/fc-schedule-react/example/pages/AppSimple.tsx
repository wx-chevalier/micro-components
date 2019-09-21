import React, { Component } from 'react';
import { GanttTimeLine, Task } from '../../src';

import './App.css';
import { Worker } from '../../src/types';

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

    let d5 = new Date();
    d5.setHours(d4.getHours() + 30);

    let d6 = new Date();
    d6.setHours(d4.getHours() + 60);

    const worker1: Worker = { id: '1', name: 'work1' };
    const worker2: Worker = { id: '2', name: 'work2' };

    this.data = [
      { id: '1', start: d1, end: d2, name: 'Demo Task 1', worker: worker1, color: '#6874E2' },
      {
        id: '2',
        start: d3,
        end: d4,
        name: 'Demo Task 2',
        worker: worker2,
        color: '#6874E2'
      },
      {
        id: '2',
        start: d5,
        end: d6,
        name: 'Demo Task 3',
        worker: worker2,
        color: '#64C5BC'
      }
    ];

    this.links = [{ id: 1, start: '1', end: '2' }];
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
            dateMode="day"
            disableLink={true}
            data={this.data}
            links={this.links}
          />
        </div>
      </div>
    );
  }
}
