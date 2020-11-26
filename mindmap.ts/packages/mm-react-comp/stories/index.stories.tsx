import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';


storiesOf('Exception', module).add(
  'with text',
  () => <div/>,
  {
    info: { inline: true }
  }
);
