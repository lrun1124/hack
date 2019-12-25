import React from 'react';

import {STATUS} from './Constans';
import {TabsList} from './TabsList';
import {
  Switch,
  Collapse,
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
        <Collapse defaultActiveKey={['apikey', 'objects']}>

          <Collapse.Panel header='Rally APIKey'  key='apikey' showArrow={false}>
            <Input placeholder={'Input Rally APIKey here...'} />
            <Button> Save </Button>
          </Collapse.Panel>

          <Collapse.Panel header='Object Fields' key='objects' showArrow={false}>
            <p>Discussion</p>
            <Switch checkedChildren='Enabled' unCheckedChildren='Disabled' defaultChecked />
          </Collapse.Panel>

        </Collapse>
      </div>
    );
  }
}
