import React, { Component } from 'react';

import {
  BUFFER_DAYS,
  DATA_CONTAINER_WIDTH,
  DATE_MODE_MONTH,
  DATE_MODE_TYPE,
  getDayWidth
} from '@/const';

import { registry, DataController, Config } from '@/controller';
import { UiConfig, BaseProps, Task, LinkType } from '@/types';

import './index.css';
import { Sider } from '../Sider';
import { VerticalSpliter } from '../Sider/VerticalSpliter';
import { Header } from '../Header';
import { LinkView } from '../LinkView';
import { DataView } from '../DataView';
import { Provider } from '@/utils/context';

interface IGanttTimeLineProps extends BaseProps {
  data: Task[];
  dateMode?: DATE_MODE_TYPE;
  viewMode?: 'task' | 'worker';

  config?: UiConfig;
  selectedItem?: Task;
  links?: LinkType[];
  nonEditableName?: boolean;

  onHorizonChange?: Function;
  onCreateLink?: Function;
  onSelectItem?: Function;
  onUpdateTask?: Function;
}

export class GanttTimeLine extends Component<IGanttTimeLineProps, any> {
  config: UiConfig;

  static defaultProps = {
    itemHeight: 40,
    dayWidth: 24,
    nonEditableName: false,
    dateMode: DATE_MODE_MONTH,
    viewMode: 'task'
  };

  dragging: boolean;
  draggingPosition: number;
  dc: DataController;
  initialise: boolean;
  pxToScroll: number;

  constructor(props) {
    super(props);
    this.dragging = false;
    this.draggingPosition = 0;
    this.dc = new DataController();
    this.dc.onHorizonChange = this.onHorizonChange;
    this.initialise = false;
    //This variable define the number of pixels the viewport can scroll till arrive to the end of the context
    this.pxToScroll = 1900;
    const dayWidth = getDayWidth(this.props.dateMode);

    this.config = new Config();
    this.config.load(this.props.config);

    // Initialising state
    this.state = {
      currentDay: 0, //Day that is in the 0px horizontal
      //nowPosition is the reference position, this variable support the infinit scrolling by accumulatning scroll times and redefining the 0 position
      // if we accumulat 2 scroll to the left nowPosition will be 2* DATA_CONTAINER_WIDTH
      nowPosition: 0,
      startRow: 0, //
      endRow: 10,
      sideStyle: { width: 200 },
      scrollLeft: 0,
      scrollTop: 0,
      numVisibleRows: 40,
      numVisibleDays: 10,
      dayWidth: dayWidth,
      interactiveMode: false,
      taskToCreate: null,
      links: [],
      dateMode: this.props.dateMode ? this.props.dateMode : DATE_MODE_MONTH,
      size: { width: 1, height: 1 },
      changingTask: null
    };
  }

  componentWillUpdate(nextProps) {
    this.checkUpdate(nextProps);
    this.checkNeedData(nextProps);
  }

  ////////////////////
  //     ON SIZE    //
  ////////////////////
  onSize = size => {
    //If size has changed
    this.calculateVerticalScrollVariables(size);
    if (!this.initialise) {
      this.dc.initialise(
        this.state.scrollLeft + this.state.nowPosition,
        this.state.scrollLeft + this.state.nowPosition + size.width,
        this.state.nowPosition,
        this.state.dayWidth
      );
      this.initialise = true;
    }
    this.setStartEnd();
    const newNumVisibleRows = Math.ceil(size.height / this.props.itemHeight);
    const newNumVisibleDays = this.calcNumVisibleDays(size);
    const rowInfo = this.calculateStartEndRows(
      newNumVisibleRows,
      this.props.data,
      this.state.scrollTop
    );
    this.setState({
      numVisibleRows: newNumVisibleRows,
      numVisibleDays: newNumVisibleDays,
      startRow: rowInfo.start,
      endRow: rowInfo.end,
      size: size
    });
  };

  /////////////////////////
  //   VIEWPORT CHANGES  //
  /////////////////////////
  verticalChange = scrollTop => {
    if (scrollTop == this.state.scrollTop) return;
    //Check if we have scrolling rows
    const rowInfo = this.calculateStartEndRows(
      this.state.numVisibleRows,
      this.props.data,
      scrollTop
    );
    if (rowInfo.start !== this.state.start) {
      this.setState(
        (this.state = {
          scrollTop: scrollTop,
          startRow: rowInfo.start,
          endRow: rowInfo.end
        })
      );
    }
  };

  calculateStartEndRows = (numVisibleRows, data, scrollTop) => {
    const newStart = Math.trunc(scrollTop / this.props.itemHeight);
    const newEnd =
      newStart + numVisibleRows >= data.length ? data.length : newStart + numVisibleRows;
    return { start: newStart, end: newEnd };
  };

  setStartEnd = () => {
    this.dc.setStartEnd(
      this.state.scrollLeft,
      this.state.scrollLeft + this.state.size.width,
      this.state.nowPosition,
      this.state.dayWidth
    );
  };

  horizontalChange = newScrollLeft => {
    let newNowPosition = this.state.nowPosition;
    let newLeft = -1;
    const headerData = this.state.headerData;
    let newStartRow = this.state.startRow;
    let newEndRow = this.state.endRow;

    //Calculating if we need to roll up the scroll
    if (newScrollLeft > this.pxToScroll) {
      //ContenLegnth-viewportLengt
      newNowPosition = this.state.nowPosition - this.pxToScroll;
      newLeft = 0;
    } else {
      if (newScrollLeft <= 0) {
        //ContenLegnth-viewportLengt
        newNowPosition = this.state.nowPosition + this.pxToScroll;
        newLeft = this.pxToScroll;
      } else {
        newLeft = newScrollLeft;
      }
    }

    //Get the day of the left position
    const currentIndx = Math.trunc((newScrollLeft - this.state.nowPosition) / this.state.dayWidth);

    //Calculate rows to render
    newStartRow = Math.trunc(this.state.scrollTop / this.props.itemHeight);
    newEndRow =
      newStartRow + this.state.numVisibleRows >= this.props.data.length
        ? this.props.data.length - 1
        : newStartRow + this.state.numVisibleRows;

    //If we need updates then change the state and the scroll position
    //Got you
    this.setStartEnd();
    this.setState({
      currentDay: currentIndx,
      nowPosition: newNowPosition,
      headerData: headerData,
      scrollLeft: newLeft,
      startRow: newStartRow,
      endRow: newEndRow
    });
  };

  calculateVerticalScrollVariables = size => {
    //The pixel to scroll verically is equal to the pecentage of what the viewport represent in the context multiply by the context width
    this.pxToScroll = (1 - size.width / DATA_CONTAINER_WIDTH) * DATA_CONTAINER_WIDTH - 1;
  };

  onHorizonChange = (lowerLimit, upLimit) => {
    if (this.props.onHorizonChange) this.props.onHorizonChange(lowerLimit, upLimit);
  };

  /////////////////////
  //   MOUSE EVENTS  //
  /////////////////////

  doMouseDown = e => {
    this.dragging = true;
    this.draggingPosition = e.clientX;
  };
  doMouseMove = e => {
    if (this.dragging) {
      const delta = this.draggingPosition - e.clientX;

      if (delta !== 0) {
        this.draggingPosition = e.clientX;
        this.horizontalChange(this.state.scrollLeft + delta);
      }
    }
  };
  doMouseUp = e => {
    this.dragging = false;
  };
  doMouseLeave = e => {
    // if (!e.relatedTarget.nodeName)
    //     this.dragging=false;
    this.dragging = false;
  };

  doTouchStart = e => {
    this.dragging = true;
    this.draggingPosition = e.touches[0].clientX;
  };
  doTouchEnd = e => {
    this.dragging = false;
  };
  doTouchMove = e => {
    if (this.dragging) {
      const delta = this.draggingPosition - e.touches[0].clientX;

      if (delta !== 0) {
        this.draggingPosition = e.touches[0].clientX;
        this.horizontalChange(this.state.scrollLeft + delta);
      }
    }
  };
  doTouchCancel = e => {
    this.dragging = false;
  };

  //Child communicating states
  onSiderSizing = delta => {
    this.setState(prevState => {
      const result = { ...prevState };
      result.sideStyle = { width: result.sideStyle.width - delta };
      return result;
    });
  };

  /////////////////////
  //   ITEMS EVENTS  //
  /////////////////////

  onSelectItem = item => {
    if (this.props.onSelectItem && item != this.props.selectedItem) this.props.onSelectItem(item);
  };

  onStartCreateLink = (task, position) => {
    console.log(`Start Link ${task}`);
    this.setState({
      interactiveMode: true,
      taskToCreate: { task: task, position: position }
    });
  };

  onFinishCreateLink = (task, position) => {
    console.log(`End Link ${task}`);
    if (this.props.onCreateLink && task) {
      this.props.onCreateLink({
        start: this.state.taskToCreate,
        end: { task: task, position: position }
      });
    }
    this.setState({
      interactiveMode: false,
      taskToCreate: null
    });
  };

  onTaskChanging = changingTask => {
    this.setState({
      changingTask: changingTask
    });
  };

  calcNumVisibleDays = size => {
    return Math.ceil(size.width / this.state.dayWidth) + BUFFER_DAYS;
  };

  checkUpdate(nextProps) {
    if (nextProps.dateMode != this.state.dateMode && nextProps.dateMode) {
      this.setState(
        {
          dateMode: nextProps.dateMode
        },
        () => {
          const newDayWidth = getDayWidth(this.state.dateMode);

          this.setState(
            {
              dayWidth: newDayWidth,
              numVisibleDays: this.calcNumVisibleDays(this.state.size)
            },
            () => {
              //to recalculate the now position we have to see how mwny scroll has happen
              //to do so we calculate the diff of days between current day and now
              //And we calculate how many times we have scroll
              const scrollTime = Math.ceil(
                (-this.state.currentDay * this.state.dayWidth) / this.pxToScroll
              );
              //We readjust now postion to the new number of scrolls
              const nowPosition = scrollTime * this.pxToScroll;
              const scrollLeft =
                (this.state.currentDay * this.state.dayWidth + nowPosition) % this.pxToScroll;

              this.setState({
                nowPosition,

                // we recalculate the new scroll Left value
                scrollLeft
              });
            }
          );
        }
      );
    }
  }

  checkNeedData = nextProps => {
    if (nextProps.data != this.state.data) {
      this.setState(
        {
          data: nextProps.data
        },
        () => {
          const rowInfo = this.calculateStartEndRows(
            this.state.numVisibleRows,
            nextProps.data,
            this.state.scrollTop
          );
          this.setState(
            {
              startRow: rowInfo.start,
              endRow: rowInfo.end
            },
            () => {
              registry.registerData(this.state.data);
            }
          );
        }
      );
    }
    if (nextProps.links != this.state.links) {
      this.setState(
        {
          links: nextProps.links
        },
        () => {
          registry.registerLinks(nextProps.links);
        }
      );
    }
  };

  render() {
    return (
      <Provider value={{ config: this.config }}>
        <div className="timeLine">
          <div className="timeLine-side-main" style={this.state.sideStyle}>
            <Sider
              ref="taskViewPort"
              itemHeight={this.props.itemHeight}
              startRow={this.state.startRow}
              endRow={this.state.endRow}
              data={this.props.data}
              selectedItem={this.props.selectedItem}
              onSelectItem={this.onSelectItem}
              onUpdateTask={this.props.onUpdateTask}
              onScroll={this.verticalChange}
              nonEditable={this.props.nonEditableName}
            />
            <VerticalSpliter config={this.config} onSiderSizing={this.onSiderSizing} />
          </div>
          <div className="timeLine-main">
            <Header
              config={this.config}
              headerData={this.state.headerData}
              numVisibleDays={this.state.numVisibleDays}
              currentDay={this.state.currentDay}
              nowPosition={this.state.nowPosition}
              dayWidth={this.state.dayWidth}
              dateMode={this.state.dateMode}
              scrollLeft={this.state.scrollLeft}
            />
            <DataView
              scrollLeft={this.state.scrollLeft}
              scrollTop={this.state.scrollTop}
              itemHeight={this.props.itemHeight}
              nowPosition={this.state.nowPosition}
              startRow={this.state.startRow}
              endRow={this.state.endRow}
              data={this.props.data}
              selectedItem={this.props.selectedItem}
              dayWidth={this.state.dayWidth}
              onMouseDown={this.doMouseDown}
              onMouseMove={this.doMouseMove}
              onMouseUp={this.doMouseUp}
              onMouseLeave={this.doMouseLeave}
              onTouchStart={this.doTouchStart}
              onTouchMove={this.doTouchMove}
              onTouchEnd={this.doTouchEnd}
              onTouchCancel={this.doTouchCancel}
              onSelectItem={this.onSelectItem}
              onUpdateTask={this.props.onUpdateTask}
              onTaskChanging={this.onTaskChanging}
              onStartCreateLink={this.onStartCreateLink}
              onFinishCreateLink={this.onFinishCreateLink}
              boundaries={{
                lower: this.state.scrollLeft,
                upper: this.state.scrollLeft + this.state.size.width
              }}
              onSize={this.onSize}
            />
            <LinkView
              scrollLeft={this.state.scrollLeft}
              scrollTop={this.state.scrollTop}
              startRow={this.state.startRow}
              endRow={this.state.endRow}
              data={this.props.data}
              nowPosition={this.state.nowPosition}
              dayWidth={this.state.dayWidth}
              interactiveMode={this.state.interactiveMode}
              taskToCreate={this.state.taskToCreate}
              onFinishCreateLink={this.onFinishCreateLink}
              changingTask={this.state.changingTask}
              selectedItem={this.props.selectedItem}
              onSelectItem={this.onSelectItem}
              itemHeight={this.props.itemHeight}
              links={this.props.links}
            />
          </div>
        </div>
      </Provider>
    );
  }
}
