import React, { Component } from 'react';

import {
  BUFFER_DAYS,
  DATA_CONTAINER_WIDTH,
  DATE_MODE_MONTH,
  DATE_MODE_TYPE,
  getDayWidth
} from '../../const';

import { dataRegistry, DataController, UiConfig, UiConfigProps } from '../../controller';
import { BaseProps, Task, TaskLink, TaskGroup } from '../../types';

import './index.less';
import { Sider } from '../../components/Sider';
import { VerticalSpliter } from '../../components/VerticalSpliter';
import { Header } from '../../components/Header';
import { LinkView } from '../../components/LinkView';
import { DataView } from '../../components/DataView';
import { Provider } from '../../utils/context';
import { LinkPos, EditingLink, EditingTask } from '../../types/index';

const prefix = 'fc-schedule-GanttTimeLine';

interface IGanttTimeLineProps extends BaseProps {
  taskGroups: TaskGroup[];
  links?: TaskLink[];
  selectedTask?: Task;
  selectedLink?: TaskLink;
  selectedTaskGroup?: TaskGroup;

  config?: Partial<UiConfigProps>;
  dateMode?: DATE_MODE_TYPE;

  ////////////////////
  //  Event Handler //
  ////////////////////
  // 点击某个数据行的响应，必然会传入当前行所属的 Worker
  onDataRowClick?: (worker: Worker) => void;

  // 如果传入了该参数，则在悬浮时显示
  onTaskPopoverRender?: (task: Task) => React.ReactNode;
  onSelectTask?: (task: Task, ref: HTMLDivElement | null) => void;
  onSelectTaskGroup?: (task: TaskGroup) => void;
  onSelectLink?: (link: TaskLink) => void;
  onUpdateTask?: (task: Task, newTask: Partial<Task>) => void;
  onUpdateTaskGroup?: (task: TaskGroup, newTaskGroup: Partial<TaskGroup>) => void;

  // 侧边栏头部渲染函数
  onSiderHeaderRender?: () => React.ReactNode;
  onHorizonChange?: (lowerLimit: number, upLimit: number) => void;

  onCreateLink?: ({ start, end }: { start: EditingLink; end: EditingLink }) => void;
}

interface IGanttTimeLineState {
  currentDay: number;
  complementalLeft: number;
  dayWidth: number;
  dateMode: DATE_MODE_TYPE;
  editingTask?: EditingTask;
  editingLink?: EditingLink;
  interactiveMode: boolean;
  links: TaskLink[];
  siderStyle: Record<string, number>;
  scrollLeft: number;
  scrollTop: number;
  size: { width: number; height: number };
  startRow: number;
  endRow: number;
  visibleRowsNum: number;
  visibleDaysNum: number;
}

export class GanttTimeLine extends Component<IGanttTimeLineProps, IGanttTimeLineState> {
  config: UiConfig;

  static defaultProps = {
    itemHeight: 40,
    dayWidth: 24,
    dateMode: DATE_MODE_MONTH,
    viewMode: 'task'
  };

  dc: DataController;
  isInitialized: boolean;
  dragging: boolean;
  draggingPosition: number;

  // 可滚动的距离，即预设距离位于可视区域之外的部分，用于进行无限滚动使用
  pxToScroll: number;

  constructor(props: IGanttTimeLineProps) {
    super(props);

    this.dragging = false;
    this.draggingPosition = 0;
    this.dc = new DataController();
    this.dc.onHorizonChange = this.onHorizonChange;
    this.isInitialized = false;
    this.pxToScroll = 2000;
    const dayWidth = getDayWidth(this.props.dateMode);

    this.config = new UiConfig();
    this.config.load(this.props.config);

    dataRegistry.registerTaskGroups(props.taskGroups);

    // Initialising state
    this.state = {
      // 当前界面上主要是处于哪天，用于判断是否到达了左右滚动边界
      currentDay: 0,
      // 随着滑动的时候，如果已经滑动的距离大于预设的宽度，则用该值计算倍数；譬如预设的宽度为 5000，可视宽度为 1200，那么滑动距离超出 5000 后，scrollLeft 值实际上会归零；此时就需要依靠 complementalLeft 来计算逻辑上的滑动距离
      complementalLeft: 0,
      dayWidth: dayWidth,
      dateMode: this.props.dateMode ? this.props.dateMode : DATE_MODE_MONTH,
      editingTask: undefined,
      interactiveMode: false,
      editingLink: undefined,
      links: [],
      siderStyle: { width: 200 },
      scrollLeft: 0,
      scrollTop: 0,
      size: { width: 1, height: 1 },
      startRow: 0,
      endRow: 10,
      visibleRowsNum: 40,
      visibleDaysNum: 10
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
    this.calcScrollVariables(size);

    if (!this.isInitialized) {
      // 初始化数据控制器
      this.dc.init(
        this.state.scrollLeft + this.state.complementalLeft,
        this.state.scrollLeft + this.state.complementalLeft + size.width,
        this.state.complementalLeft,
        this.state.dayWidth
      );
      this.isInitialized = true;
    }

    this.setStartEnd();

    const newNumVisibleRows = Math.ceil(size.height / this.props.itemHeight);
    const newNumVisibleDays = this.calcNumVisibleDays(size);
    const rowInfo = this.calcStartEndRows(
      newNumVisibleRows,
      this.props.taskGroups.length,
      this.state.scrollTop
    );

    this.setState({
      visibleRowsNum: newNumVisibleRows,
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
    // Check if we have scrolling rows
    const rowInfo = this.calcStartEndRows(
      this.state.visibleRowsNum,
      this.props.taskGroups.length,
      scrollTop
    );

    if (rowInfo.start !== this.state.startRow) {
      this.setState({
        scrollTop: scrollTop,
        startRow: rowInfo.start,
        endRow: rowInfo.end
      });
    }
  };

  calcStartEndRows = (visibleRowsNum: number, totalRowsNum: number, scrollTop: number) => {
    const newStart = Math.trunc(scrollTop / this.props.itemHeight);
    const newEnd =
      newStart + visibleRowsNum >= totalRowsNum ? totalRowsNum : newStart + visibleRowsNum;
    return { start: newStart, end: newEnd };
  };

  setStartEnd = () => {
    this.dc.setStartEnd(
      this.state.scrollLeft,
      this.state.scrollLeft + this.state.size.width,
      this.state.complementalLeft,
      this.state.dayWidth
    );
  };

  onHorizontalScroll = newScrollLeft => {
    let newNowPosition = this.state.complementalLeft;
    let newLeft = -1;
    let newStartRow = this.state.startRow;
    let newEndRow = this.state.endRow;

    // Calculating if we need to roll up the scroll，
    // 当滚动距离超出了预设的滚动距离，则重置 complementalLeft
    if (newScrollLeft > this.pxToScroll) {
      // Content Length - Viewport Length
      newNowPosition = this.state.complementalLeft - this.pxToScroll;
      newLeft = 0;
    } else {
      // 滚动出最右侧之后，再向左滑动
      if (newScrollLeft <= 0) {
        // Content Length - Viewport Length
        newNowPosition = this.state.complementalLeft + this.pxToScroll;
        newLeft = this.pxToScroll;
      } else {
        newLeft = newScrollLeft;
      }
    }

    // Get the day of the left position，取整
    const currentDay = Math.trunc(
      (newScrollLeft - this.state.complementalLeft) / this.state.dayWidth
    );

    // Calculate rows to render
    newStartRow = Math.trunc(this.state.scrollTop / this.props.itemHeight);
    newEndRow =
      newStartRow + this.state.visibleRowsNum >= this.props.taskGroups.length
        ? this.props.taskGroups.length - 1
        : newStartRow + this.state.visibleRowsNum;

    // If we need updates then change the state and the scroll position

    this.setStartEnd();
    this.setState({
      currentDay,
      complementalLeft: newNowPosition,
      scrollLeft: newLeft,
      startRow: newStartRow,
      endRow: newEndRow
    });
  };

  calcScrollVariables = size => {
    // The pixel to scroll verically is equal to the pecentage of what the viewport represent in the context multiply by the context width
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

  onMouseMove = (clientX: number) => {
    if (this.dragging) {
      const delta = this.draggingPosition - clientX;

      if (delta !== 0) {
        this.draggingPosition = clientX;
        this.onHorizontalScroll(this.state.scrollLeft + delta);
      }
    }
  };

  onMouseUp = () => {
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
    this.setState({
      siderStyle: {
        width: this.state.siderStyle.width - delta
      }
    });
  };

  /////////////////////
  //   ITEMS EVENTS  //
  /////////////////////

  onStartCreateLink = (task: Task, position: LinkPos) => {
    console.log(`Start Link ${task}`);
    this.setState({
      interactiveMode: true,
      editingLink: { task: task, position: position }
    });
  };

  onFinishCreateLink = (task: Task, position: LinkPos) => {
    console.log(`End Link ${task}`);
    if (this.props.onCreateLink && task && this.state.editingLink) {
      this.props.onCreateLink({
        start: this.state.editingLink,
        end: { task: task, position }
      });
    }

    this.setState({
      interactiveMode: false,
      editingLink: undefined
    });
  };

  onTaskChanging = (editingTask: { task: Task; position: { start: number; end: number } }) => {
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
              // to recalculate the now position we have to see how mwny scroll has happen to do so we calculate the diff of days between current day and now And we calculate how many times we have scroll
              const scrollTime = Math.ceil(
                (-this.state.currentDay * this.state.dayWidth) / this.pxToScroll
              );
              // We readjust now postion to the new number of scrolls
              const complementalLeft = scrollTime * this.pxToScroll;
              const scrollLeft =
                (this.state.currentDay * this.state.dayWidth + complementalLeft) % this.pxToScroll;

              this.setState({
                complementalLeft,

                // we recalculate the new scroll Left value
                scrollLeft
              });
            }
          );
        }
      );
    }
  }

  checkNeedData = (nextProps: IGanttTimeLineProps) => {
    if (nextProps.taskGroups !== this.props.taskGroups) {
      const rowInfo = this.calcStartEndRows(
        this.state.visibleRowsNum,
        nextProps.taskGroups.length,
        this.state.scrollTop
      );

      this.setState(
        {
          startRow: rowInfo.start,
          endRow: rowInfo.end
        },
        () => {
          dataRegistry.registerTaskGroups(nextProps.taskGroups);
        }
      );
    }

    if (nextProps.links != this.state.links) {
      this.setState(
        {
          links: nextProps.links || []
        },
        () => {
          dataRegistry.registerLinks(nextProps.links);
        }
      );
    }
  };

  render() {
    return (
      <Provider value={{ config: this.config }}>
        <div className={prefix}>
          <div className="timeLine-side-main" style={this.state.siderStyle}>
            <Sider
              itemHeight={this.props.itemHeight}
              startRow={this.state.startRow}
              endRow={this.state.endRow}
              taskGroups={this.props.taskGroups}
              selectedTaskGroup={this.props.selectedTaskGroup}
              nonEditable={this.config.values.disableEditableName}
              onSelectTaskGroup={this.props.onSelectTaskGroup}
              onUpdateTaskGroup={this.props.onUpdateTaskGroup}
              onScroll={this.verticalChange}
            />
            <VerticalSpliter config={this.config} onResizing={this.onSiderResizing} />
          </div>

          <div className="timeLine-main">
            {this.config.values.showController && (
              <div className={`${prefix}-controller`}>
                <div
                  className={`${prefix}-controller-prev`}
                  onClick={() => {
                    this.onHorizontalScroll(this.state.scrollLeft - 200);
                  }}
                ></div>
                <div
                  className={`${prefix}-controller-next`}
                  onClick={() => {
                    this.onHorizontalScroll(this.state.scrollLeft + 200);
                  }}
                ></div>
              </div>
            )}

            <Header
              config={this.config}
              visibleDaysNum={this.state.visibleDaysNum}
              currentDay={this.state.currentDay}
              complementalLeft={this.state.complementalLeft}
              dayWidth={this.state.dayWidth}
              dateMode={this.state.dateMode}
              scrollLeft={this.state.scrollLeft}
            />

            <DataView
              scrollLeft={this.state.scrollLeft}
              scrollTop={this.state.scrollTop}
              itemHeight={this.props.itemHeight}
              complementalLeft={this.state.complementalLeft}
              startRow={this.state.startRow}
              endRow={this.state.endRow}
              taskGroups={this.props.taskGroups}
              selectedTask={this.props.selectedTask}
              dayWidth={this.state.dayWidth}
              boundaries={{
                lower: this.state.scrollLeft,
                upper: this.state.scrollLeft + this.state.size.width
              }}
              disableLink={this.config.values.disableLink}
              onFinishCreateLink={this.onFinishCreateLink}
              onMouseDown={this.doMouseDown}
              onMouseMove={(e: MouseEvent) => {
                this.onMouseMove(e.clientX);
              }}
              onMouseUp={this.onMouseUp}
              onMouseLeave={this.doMouseLeave}
              onSelectTask={this.props.onSelectTask}
              onStartCreateLink={this.onStartCreateLink}
              onSize={this.onResizing}
              onTaskPopoverRender={this.props.onTaskPopoverRender}
              onTouchStart={this.doTouchStart}
              onTouchMove={this.doTouchMove}
              onTouchEnd={this.doTouchEnd}
              onTouchCancel={this.doTouchCancel}
              onTaskChanging={this.onTaskChanging}
              onUpdateTask={this.props.onUpdateTask}
            />

            {!this.config.values.disableLink && (
              <LinkView
                complementalLeft={this.state.complementalLeft}
                dayWidth={this.state.dayWidth}
                editingLink={this.state.editingLink}
                editingTask={this.state.editingTask}
                interactiveMode={this.state.interactiveMode}
                itemHeight={this.props.itemHeight}
                links={this.props.links || []}
                scrollLeft={this.state.scrollLeft}
                scrollTop={this.state.scrollTop}
                selectedLink={this.props.selectedLink}
                startRow={this.state.startRow}
                endRow={this.state.endRow}
                taskGroups={this.props.taskGroups}
                onSelectLink={this.props.onSelectLink}
                onFinishCreateLink={this.onFinishCreateLink}
              />
            )}
          </div>
        </div>
      </Provider>
    );
  }
}
