import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

import App from './pages/App';
import AppSimple from './pages/AppSimple';

ReactDOM.render(
  <div>
    <Tabs>
      <TabList>
        <Tab>简单示例</Tab>
        <Tab>完整实例</Tab>
      </TabList>

      <TabPanel>
        <AppSimple />
      </TabPanel>
      <TabPanel>
        <App />
      </TabPanel>
    </Tabs>
  </div>,
  document.getElementById('root')
);
