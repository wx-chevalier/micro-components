import React, { Component } from 'react';

import { dataRegistry, dateHelper } from '../../controller';

import { Link } from './Link';
import { DraftLink } from './DraftLink';
import { TaskLink, Task, LinkPos } from '../../types';
import { TaskGroup, UiConfig, EditingTask } from '../../types/index';

export interface ILinkViewProps {
  complementalLeft: number;
  config?: UiConfig;
  dayWidth: number;
  editingTask?: { task: Task; position: { start: number; end: number } };
  editingLink?: { task: Task; position: LinkPos };
  interactiveMode: boolean;
  itemHeight: number;
  links: TaskLink[];
  selectedLink?: TaskLink;
  scrollLeft: number;
  scrollTop: number;
  startRow: number;
  endRow: number;
  taskGroups: TaskGroup[];

  onSelectLink?: (link: TaskLink) => void;
  onFinishCreateLink: (task: Task, pos: LinkPos) => void;
}

export interface ILinkViewState {
  dayWidth: number;
  editingTask?: EditingTask;
  links: TaskLink[];
  taskGroups: TaskGroup[];
  selectedLink?: TaskLink;
}

export class LinkView extends Component<ILinkViewProps, ILinkViewState> {
  cache: React.ReactNode[];

  constructor(props) {
    super(props);
    this.cache = [];
    this.state = { dayWidth: props.dayWidth, links: [], taskGroups: [], selectedLink: undefined };
  }

  getItemPosition = (rowNum: number, date) => {
    const x = dateHelper.dateToPixel(date, 0, this.props.dayWidth);
    const y = rowNum * this.props.itemHeight + this.props.itemHeight / 2;
    return { x: x, y: y };
  };

  renderLink(
    startTask: { item: Task; rowNum: number },
    endTask: { item: Task; rowNum: number },
    link: TaskLink,
    key: number
  ) {
    const startPosition = this.getItemPosition(startTask.rowNum, startTask.item.end);
    const endPosition = this.getItemPosition(endTask.rowNum, endTask.item.start);

    return (
      <Link
        key={key}
        link={link}
        start={{ x: startPosition.x, y: startPosition.y }}
        end={{ x: endPosition.x, y: endPosition.y }}
        isSelected={this.props.selectedLink == link}
        onSelectLink={this.props.onSelectLink}
      />
    );
  }

  renderLinks() {
    this.cache = [];
    const renderedLinks = {};

    if (this.state.taskGroups.length == 0) return;
    for (let i = 0; i < this.state.links.length; i++) {
      const link: TaskLink = this.state.links[i];

      if (!link || renderedLinks[link.id]) {
        continue;
      }

      const startItem = dataRegistry.getTask(link.start);
      if (!startItem) {
        this.cache.push(null);
        continue;
      }

      const endItem = dataRegistry.getTask(link.end);
      if (!endItem) {
        this.cache.push(null);
        continue;
      }

      this.cache.push(this.renderLink(startItem, endItem, link, i));
      renderedLinks[link.id] = '';
    }
  }

  refreshData() {
    if (
      this.props.links != this.state.links ||
      this.props.taskGroups != this.state.taskGroups ||
      this.props.dayWidth != this.state.dayWidth ||
      this.props.selectedLink != this.state.selectedLink
    ) {
      const { selectedLink, dayWidth, links, taskGroups } = this.props;

      this.setState({ selectedLink, dayWidth, links, taskGroups }, () => {
        if (this.state.links && this.state.taskGroups) {
          this.renderLinks();
        }
      });
    }
  }

  renderCreateLink = () => {
    const { interactiveMode, editingLink } = this.props;

    if (interactiveMode && editingLink) {
      const record = dataRegistry.getTask(editingLink.task.id);

      const position = this.getItemPosition(record.rowNum, record.item.end);

      return (
        <DraftLink
          start={position}
          onFinishCreateLink={() => {
            this.props.onFinishCreateLink(editingLink.task, editingLink.position);
          }}
        />
      );
    }
    return null;
  };

  renderChangingTaskLinks = () => {
    if (this.state.editingTask && this.props.editingTask !== this.state.editingTask) {
      this.setState(
        {
          editingTask: this.props.editingTask
        },
        () => {
          const { editingTask } = this.state;
          if (!editingTask) {
            return;
          }

          // Get Links from task
          const links = dataRegistry.getLinks(editingTask!.task.id);
          if (!links) {
            return;
          }

          let item: any = null;
          let startItem: any = null;
          let endItem: any = null;
          let startPosition: any = {};
          let endPosition: any = {};

          for (let i = 0; i < links.length; i++) {
            item = links[i];

            startItem = dataRegistry.getTask(item.link.start);
            if (!startItem) continue;

            endItem = dataRegistry.getTask(item.link.end);
            if (!endItem) continue;

            startPosition = this.getItemPosition(startItem.index, startItem.item.end);
            if (editingTask.task.id == item.link.start) {
              startPosition.x = editingTask.position.end;
            }

            endPosition = this.getItemPosition(endItem.index, endItem.item.start);
            if (editingTask.task.id == item.link.end) {
              endPosition.x = editingTask.position.start;
            }

            this.cache[item.index] = (
              <Link
                key={-i - 1}
                link={item}
                start={{ x: startPosition.x, y: startPosition.y }}
                end={{ x: endPosition.x, y: endPosition.y }}
                isSelected={this.props.selectedLink == item}
                onSelectLink={this.props.onSelectLink}
              />
            );
            this.cache = [...this.cache];
          }
        }
      );
    }
  };

  render() {
    this.refreshData();
    this.renderChangingTaskLinks();

    return (
      <svg
        x={0}
        y={0}
        width="100%"
        pointerEvents="none"
        style={{ position: 'absolute', top: 60, userSelect: 'none', height: '100%' }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" strokeLinejoin="round" />
          </marker>
        </defs>
        <g
          transform={`matrix(1,0,0,1,${-(
            this.props.scrollLeft - this.props.complementalLeft
          )},${-this.props.scrollTop})`}
        >
          {this.cache}
          {this.renderCreateLink()}
        </g>
      </svg>
    );
  }
}
