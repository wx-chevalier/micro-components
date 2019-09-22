import React, { Component } from 'react';
import { GanttTimeLine, TaskGroup, TaskLink } from '../../src';

import './App.css';

import moment from 'moment';

export default class AppSimple extends Component<any, any> {
  data: TaskGroup[];
  links: TaskLink[];

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

    this.data = [
      {
        id: '1',
        name: 'Task Group 1',
        tasks: [{ id: '1', start: d1, end: d2, name: 'Demo Task 1', color: '#6874E2' }]
      },
      {
        id: '2',
        name: 'Task Group 2',
        tasks: [
          {
            id: '2',
            start: d3,
            end: d4,
            name: 'Demo Task 2',
            color: '#6874E2'
          },
          {
            id: '3',
            start: d5,
            end: d6,
            name: 'Demo Task 3',
            color: '#64C5BC'
          }
        ]
      }
    ];

    this.links = [{ id: '1', start: 1, end: 2 }];
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
            disableLink={false}
            links={this.links}
            taskGroups={this.data}
            visuallyStartDate={moment().subtract(2, 'day')}
            onCreateLink={(...args) => {
              console.log(args);
            }}
          />
        </div>
      </div>
    );
  }
}
