import React, { Component } from 'react';
import { GanttTimeLine, TaskGroup, TaskLink } from '../../src';

import './App.css';
interface IState {
  data: TaskGroup[];
  links: TaskLink[];
}

export default class AppSimple extends Component<{}, IState> {
  state = { data: [], links: [] };

  componentDidMount() {
    this.loadData();

    setTimeout(() => {
      this.loadData();
    }, 500);
  }

  loadData() {
    const d1 = new Date();

    const d2 = new Date();
    d2.setHours(d2.getHours() + 5);

    const d3 = new Date();
    d3.setHours(d3.getHours() + 8);

    const d4 = new Date();
    d4.setHours(d4.getHours() + 20);

    const d5 = new Date();
    d5.setHours(d4.getHours() + 30);

    const d6 = new Date();
    d6.setHours(d4.getHours() + 60);

    const data = [
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

    const links = [{ id: '1', start: 1, end: 2 }];

    this.setState({ data, links });
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { data, links } = this.state;

    return (
      <div className="app-container">
        <div className="time-line-container">
          <GanttTimeLine
            config={{ disableEditableName: true, disableLink: true }}
            dateMode="day"
            links={links}
            taskGroups={data}
            onCreateLink={(...args) => {
              console.log(args);
            }}
            onTaskPopoverRender={() => (
              <div style={{ backgroundColor: 'black', width: 50, height: 50 }}>Popover</div>
            )}
            onSelectTask={(...args) => {
              console.log(args);
            }}
          />
        </div>
      </div>
    );
  }
}
