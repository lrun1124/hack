import React from 'react';

import {STATUS} from './Constans';
import {TabsList} from './TabsList';
import {
  Checkbox,
  Input,
  Button,
} from 'antd';

export default class App extends React.PureComponent {

  state = {

  }

  onChange = evt => {

  }

  render() {
    return (
      <div className="app-container">
        <Input
          placeholder={'Rally API key'}
        />
        <div>
          <Button>submit</Button>
        </div>
        <div>
          <Checkbox>Discussion</Checkbox>
        </div>
      </div>
    );
  }
}
