import React from 'react';
import logo from './ms_logo.png'


import {
  Switch,
  Avatar,
  Input,
  Button,
} from 'antd';

export default class App extends React.PureComponent {

  state = {
    showKey: true,
    login: false
  }
  switchPanel = () => {
    this.setState({
      showKey: !this.state.showKey
    });
  }
  submitClick = (e) => {
    this.setState({
      showKey: !this.state.showKey,
      login: true
    });
    //window.APIKey
  }
  render() {
    const {showKey, login} = this.state
    const apiKeyPanel = (
      <div className="app-apiKeyPanel">
        <Input className="app-input" placeholder={'Input Rally APIKey here'} />
        <Button className="app-submit" onClick={this.submitClick}> Save </Button>
      </div>
    )
    const editablePanel = (
      <div className="app-editablePanel">
        <div style={{ fontWeight: 'bold'}}>Editable Column</div>
        <div className="app-field">
          <span className="app-dis">Discussion</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultChecked />
        </div>
        <div className="app-field">
          <span className="app-dis">Regression</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultChecked />
        </div>
        <div className="app-field">
          <span className="app-dis">Iteration</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultChecked />
        </div>
        <div className="app-field">
          <span className="app-dis">Tag</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultChecked />
        </div>
        <div className="app-field">
          <span className="app-dis">PM status</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultChecked />
        </div>
      </div>
    )
    var loginPanel
    if(login) {
      loginPanel = (<Avatar style={{ backgroundColor: '#87d068'}} className="app-Avatar" icon="user" onClick={this.switchPanel}/>
      )
    } else {
      loginPanel = (<Avatar icon="user" className="app-Avatar"/>)
    }
    if(showKey) {
      return (
        <div className="app-container">
            <div>
              <img src="./src/ms_logo.png" className="app-logo"></img>
              {loginPanel}
            </div>
            {apiKeyPanel}
        </div>
      );
    } else {
      return (
        <div className="app-container">
            <div>
              <img src="./src/ms_logo.png" className="app-logo"></img>
              {loginPanel}
            </div>
            {editablePanel}
        </div>
      );
    }
  }
}
