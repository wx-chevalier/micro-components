import React, { Component } from 'react';

import {
  BUFFER_DAYS,
  DATA_CONTAINER_WIDTH,
  DATE_MODE_MONTH,
  DATE_MODE_TYPE,
  getDayWidth
} from '../../const';

import { registry, DataController, Config } from '../../controller';
import { UiConfig, BaseProps, Task, LinkType } from '../../types';

import './index.css';
import { Sider } from '../../components/Sider';
import { VerticalSpliter } from '../../components/VerticalSpliter';
import { Header } from '../../components/Header';
import { LinkView } from '../../components/LinkView';
import { DataView } from '../../components/DataView';
import { Provider } from '../../utils/context';

interface IGanttTimeLineProps extends BaseProps {
  data: Task[];
  links?: LinkType[];
  selectedItem?: Task;
  currentDay?: number;

  config?: UiConfig;
  dateMode?: DATE_MODE_TYPE;
  viewMode?: 'task' | 'worker';

  // 是否允许编辑名称
  disableEditableName?: boolean;
  // 是否使用 Link
  disableLink?: boolean;

  ////////////////////
  //  Event Handler //
  ////////////////////
  // 点击某个数据行的响应，必然会传入当前行所属的 Worker
  onDataRowClick?: (worker: Worker) => void;

  onTaskDetailRender?: (task: Task) => React.ReactNode;
  // 在左侧栏或者右侧栏中选择 Task 的回调
  onSelectTask?: (task: Task) => void;
  onUpdateTask?: (task: Task, newTask: Partial<Task>) => void;

  // 侧边栏头部渲染函数
  onSiderHeaderRender?: () => React.ReactNode;
  onHorizonChange?: (lowerLimit: number, upLimit: number) => void;

  onCreateLink?: Function;
}

export class GanttTimeLine extends Component<IGanttTimeLineProps, any> {
  config: UiConfig;

  static defaultProps = {
    currentDay: 0,
    itemHeight: 40,
    dayWidth: 24,
    disableEditableName: false,
    disableLink: false,
    dateMode: DATE_MODE_MONTH,
    viewMode: 'task'
  };

  dc: DataController;
  isInitialized: boolean;
  dragging: boolean;
  draggingPosition: number;

  // 右侧横向滚动的距离
  pxToScroll: number;

  constructor(props: IGanttTimeLineProps) {
    super(props);

    this.dragging = false;
    this.draggingPosition = 0;
    this.dc = new DataController();
    this.dc.onHorizonChange = this.onHorizonChange;
    this.isInitialized = false;
    this.pxToScroll = 1900;
    const dayWidth = getDayWidth(this.props.dateMode);

    this.config = new Config();
    this.config.load(this.props.config);

    // Initialising state
    this.state = {
      // Day that is in the 0px horizontal
      currentDay: props.currentDay,
      //nowPosition is the reference position, this variable support the infinit scrolling by accumulatning scroll times and redefining the 0 position. if we accumulat 2 scroll to the left nowPosition will be 2 * DATA_CONTAINER_WIDTH
      nowPosition: 0,
      startRow: 0,
      endRow: 10,
      siderStyle: { width: 200 },
      scrollLeft: 0,
      scrollTop: 0,
      numVisibleRows: 40,
      visibleDaysNum: 10,
      dayWidth: dayWidth,
      interactiveMode: false,
      linkingTask: null,
      links: [],
      dateMode: this.props.dateMode ? this.props.dateMode : DATE_MODE_MONTH,
      size: { width: 1, height: 1 },
      editingTask: null
    };
  }

  componentWillUpdate(nextProps) {
    this.checkUpdate(nextProps);
    this.checkNeedData(nextProps);
  }

  ////////////////////
  //     ON SIZE    //
  ////////////////////
  onResizing = size => {
    //If size has changed
    this.calculateVerticalScrollVariables(size);

    if (!this.isInitialized) {
      // 初始化数据控制器
      this.dc.init(
        this.state.scrollLeft + this.state.nowPosition,
        this.state.scrollLeft + this.state.nowPosition + size.width,
        this.state.nowPosition,
        this.state.dayWidth
      );
      this.isInitialized = true;
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
      visibleDaysNum: newNumVisibleDays,
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

  onHorizontalScroll = newScrollLeft => {
    let newNowPosition = this.state.nowPosition;
    let newLeft = -1;
    let newStartRow = this.state.startRow;
    let newEndRow = this.state.endRow;

    // Calculating if we need to roll up the scroll
    if (newScrollLeft > this.pxToScroll) {
      // Content Length - Viewport Length
      newNowPosition = this.state.nowPosition - this.pxToScroll;
      newLeft = 0;
    } else {
      if (newScrollLeft <= 0) {
        //Content Length - Viewport Length
        newNowPosition = this.state.nowPosition + this.pxToScroll;
        newLeft = this.pxToScroll;
      } else {
        newLeft = newScrollLeft;
      }
    }

    // Get the day of the left position
    const currentDay = Math.trunc((newScrollLeft - this.state.nowPosition) / this.state.dayWidth);

    // Calculate rows to render
    newStartRow = Math.trunc(this.state.scrollTop / this.props.itemHeight);
    newEndRow =
      newStartRow + this.state.numVisibleRows >= this.props.data.length
        ? this.props.data.length - 1
        : newStartRow + this.state.numVisibleRows;

    // If we need updates then change the state and the scroll position

    this.setStartEnd();
    this.setState({
      currentDay,
      nowPosition: newNowPosition,
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
  doMouseDown = (e: MouseEvent) => {
    this.dragging = true;
    this.draggingPosition = e.clientX;
  };

  doMouseMove = (e: MouseEvent) => {
    if (this.dragging) {
      const delta = this.draggingPosition - e.clientX;

      if (delta !== 0) {
        this.draggingPosition = e.clientX;
        this.onHorizontalScroll(this.state.scrollLeft + delta);
      }
    }
  };

  doMouseUp = () => {
    this.dragging = false;
  };

  doMouseLeave = () => {
    this.dragging = false;
  };

  doTouchStart = (e: TouchEvent) => {
    this.dragging = true;
    this.draggingPosition = e.touches[0].clientX;
  };

  doTouchEnd = () => {
    this.dragging = false;
  };

  doTouchMove = (e: TouchEvent) => {
    if (this.dragging) {
      const delta = this.draggingPosition - e.touches[0].clientX;

      if (delta !== 0) {
        this.draggingPosition = e.touches[0].clientX;
        this.onHorizontalScroll(this.state.scrollLeft + delta);
      }
    }
  };

  doTouchCancel = () => {
    this.dragging = false;
  };

  // Child communicating states
  onSiderResizing = delta => {
    this.setState(prevState => {
      const result = { ...prevState };
      result.siderStyle = { width: result.siderStyle.width - delta };
      return result;
    });
  };

  /////////////////////
  //   ITEMS EVENTS  //
  /////////////////////
  onSelectTask = item => {
    if (this.props.onSelectTask && item != this.props.selectedItem) this.props.onSelectTask(item);
  };

  onStartCreateLink = (task, position) => {
    console.log(`Start Link ${task}`);
    this.setState({
      interactiveMode: true,
      linkingTask: { task: task, position: position }
    });
  };

  onFinishCreateLink = (task, position) => {
    console.log(`End Link ${task}`);
    if (this.props.onCreateLink && task) {
      this.props.onCreateLink({
        start: this.state.linkingTask,
        end: { task: task, position: position }
      });
    }
    this.setState({
      interactiveMode: false,
      linkingTask: null
    });
  };

  onTaskChanging = editingTask => {
    this.setState({
      editingTask: editingTask
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
              visibleDaysNum: this.calcNumVisibleDays(this.state.size)
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
    const { disableLink } = this.props;
    return (
      <Provider value={{ config: this.config }}>
        <div className="timeLine">
          <div className="timeLine-side-main" style={this.state.siderStyle}>
            <Sider
              ref="taskViewPort"
              itemHeight={this.props.itemHeight}
              startRow={this.state.startRow}
              endRow={this.state.endRow}
              data={this.props.data}
              selectedItem={this.props.selectedItem}
              nonEditable={this.props.disableEditableName}
              onSelectTask={this.onSelectTask}
              onUpdateTask={this.props.onUpdateTask}
              onScroll={this.verticalChange}
            />
            <VerticalSpliter config={this.config} onResizing={this.onSiderResizing} />
          </div>
          <div className="timeLine-main">
            <Header
              config={this.config}
              visibleDaysNum={this.state.visibleDaysNum}
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
              boundaries={{
                lower: this.state.scrollLeft,
                upper: this.state.scrollLeft + this.state.size.width
              }}
              disableLink={disableLink}
              onMouseDown={this.doMouseDown}
              onMouseMove={this.doMouseMove}
              onMouseUp={this.doMouseUp}
              onMouseLeave={this.doMouseLeave}
              onTouchStart={this.doTouchStart}
              onTouchMove={this.doTouchMove}
              onTouchEnd={this.doTouchEnd}
              onTouchCancel={this.doTouchCancel}
              onSelectTask={this.onSelectTask}
              onUpdateTask={this.props.onUpdateTask}
              onTaskChanging={this.onTaskChanging}
              onStartCreateLink={this.onStartCreateLink}
              onFinishCreateLink={this.onFinishCreateLink}
              onResizing={this.onResizing}
            />

            {!disableLink && (
              <LinkView
                scrollLeft={this.state.scrollLeft}
                scrollTop={this.state.scrollTop}
                startRow={this.state.startRow}
                endRow={this.state.endRow}
                data={this.props.data}
                nowPosition={this.state.nowPosition}
                dayWidth={this.state.dayWidth}
                interactiveMode={this.state.interactiveMode}
                linkingTask={this.state.linkingTask}
                onFinishCreateLink={this.onFinishCreateLink}
                editingTask={this.state.editingTask}
                selectedItem={this.props.selectedItem}
                onSelectTask={this.onSelectTask}
                itemHeight={this.props.itemHeight}
                links={this.props.links}
              />
            )}
          </div>
        </div>
      </Provider>
    );
  }
}
