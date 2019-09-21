import React, { Component } from 'react';

import { registry, dateHelper } from '../../controller';

import { Link } from './Link';
import { DraftLink } from './DraftLink';

export class LinkView extends Component<any, any> {
  cache: any;

  constructor(props) {
    super(props);
    this.cache = [];
    this.state = { links: [], data: [], selectedItem: null };
  }

  renderLink(startItem, endItem, link, key) {
    const startPosition = this.getItemPosition(startItem.index, startItem.item.end);
    const endPosition = this.getItemPosition(endItem.index, endItem.item.start);
    return (
      <Link
        key={key}
        item={link}
        start={{ x: startPosition.x, y: startPosition.y }}
        end={{ x: endPosition.x, y: endPosition.y }}
        isSelected={this.props.selectedItem == link}
        onSelectTask={this.props.onSelectTask}
      />
    );
  }

  getItemPosition = (index, date) => {
    const x = dateHelper.dateToPixel(date, 0, this.props.dayWidth);
    const y = index * this.props.itemHeight + this.props.itemHeight / 2;
    return { x: x, y: y };
  };

  renderLinks() {
    this.cache = [];
    const renderLinks = {};
    let startItem,
      endItem = {};
    if (this.state.data.length == 0) return;
    for (let i = 0; i < this.state.links.length; i++) {
      const link = this.state.links[i];
      if (!link) if (renderLinks[link.id]) continue;
      startItem = registry.getTask(link.start);
      if (!startItem) {
        this.cache.push(null);
        continue;
      }
      endItem = registry.getTask(link.end);
      if (!endItem) {
        this.cache.push(null);
        continue;
      }

      this.cache.push(this.renderLink(startItem, endItem, link, i));
      renderLinks[link.id] = '';
    }
  }

  refreshData() {
    if (
      this.props.links != this.state.links ||
      this.props.data != this.state.data ||
      this.props.dayWidth != this.state.dayWidth ||
      this.props.selectedItem != this.state.selectedItem
    ) {
      const { selectedItem, dayWidth, links, data } = this.props;
      this.setState({ selectedItem, dayWidth, links, data }, () => {
        if (this.state.links && this.state.data) this.renderLinks();
      });
    }
  }

  renderCreateLink = () => {
    if (this.props.interactiveMode) {
      const record = registry.getTask(this.props.taskToCreate.task.id);
      const position = this.getItemPosition(record.index, record.item.end);
      return <DraftLink start={position} onFinishCreateLink={this.props.onFinishCreateLink} />;
    }
    return null;
  };

  renderChangingTaskLinks = () => {
    if (this.props.changingTask != this.state.changingTask) {
      this.setState(
        {
          changingTask: this.props.changingTask
        },
        () => {
          //Get Links from task
          const links = registry.getLinks(this.state.changingTask.item.id);
          if (!links) return;
          let item: any = null;
          let startItem: any = null;
          let endItem: any = null;
          let startPosition: any = {};
          let endPosition: any = {};
          for (let i = 0; i < links.length; i++) {
            item = links[i];
            startItem = registry.getTask(item.link.start);
            if (!startItem) continue;
            endItem = registry.getTask(item.link.end);
            if (!endItem) continue;
            startPosition = this.getItemPosition(startItem.index, startItem.item.end);
            if (this.state.changingTask.item.id == item.link.start)
              startPosition.x = this.state.changingTask.position.end;
            endPosition = this.getItemPosition(endItem.index, endItem.item.start);
            if (this.state.changingTask.item.id == item.link.end)
              endPosition.x = this.state.changingTask.position.start;

            this.cache[item.index] = (
              <Link
                key={-i - 1}
                item={item}
                start={{ x: startPosition.x, y: startPosition.y }}
                end={{ x: endPosition.x, y: endPosition.y }}
                isSelected={this.props.selectedItem == item}
                onSelectTask={this.props.onSelectTask}
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
          transform={`matrix(1,0,0,1,${-(this.props.scrollLeft - this.props.nowPosition)},${-this
            .props.scrollTop})`}
        >
          {this.cache}
          {this.renderCreateLink()}
        </g>
      </svg>
    );
  }
}
