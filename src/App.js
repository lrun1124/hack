import React from 'react';
import logo from './ms_logo.png'
import {
  Switch,
  Avatar,
  Input,
  Button,
} from 'antd';

const RALLY_PROPERTIES = 'Rally';
const APIKEY = 'apiKey';
const DISCUSSION = 'DISCUSSION';
const TAG = 'TAG';
const PMSTATUS = 'PMSTATUS';
if (!localStorage.getItem(RALLY_PROPERTIES)) {
  let rallyValue = {
    apiKey: '',
    defectFields: {},
    DISCUSSION: false,
    TAG: false,
    PMSTATUS: false
  };
  localStorage.setItem(RALLY_PROPERTIES, JSON.stringify(rallyValue));
}

var sendMessageToContentScript = (message, callback) => {
  getCurrentTabId((tabId) =>
  {
    chrome.tabs.sendMessage(tabId, message, function(response)
    {
      if(callback) callback(response);
    });
  });
}

 var getCurrentTabId = (callback) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  if(callback) callback(tabs.length ? tabs[0].id: null);
  });
}

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    const apiKey = this.getProperty(APIKEY);
    const discussEnabled = this.getProperty(DISCUSSION);
    const tagEnabled = this.getProperty(TAG);
    const pmstatusEnabled = this.getProperty(PMSTATUS);
    this.state = {
      editKey: !apiKey,
      login: !!apiKey,
      inputKeyString: apiKey,
      discussEnabled: discussEnabled,
      statusEnabled: pmstatusEnabled,
      tagEnabled: tagEnabled
    };
  }

  getProperty = (key) => {
    const rallyValue = JSON.parse(localStorage.getItem(RALLY_PROPERTIES));
    return rallyValue[key];
  }

  updateProperty = (key, value) => {
    let rallyValue = JSON.parse(localStorage.getItem(RALLY_PROPERTIES));
    rallyValue[key] = value;
    localStorage.setItem(RALLY_PROPERTIES, JSON.stringify(rallyValue));
    this.sendMessageToContentScript(rallyValue, (response) => {
      if(response) console('content-script：'+ response);
    });
  }
  // 向content-script主动发送消息
  sendMessageToContentScript = (message, callback) => {
    this.getCurrentTabId((tabId) =>
    {
      chrome.tabs.sendMessage(tabId, message, function(response)
      {
        if(callback) callback(response);
      });
    });
  }

   getCurrentTabId = (callback) => {
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		if(callback) callback(tabs.length ? tabs[0].id: null);
	  });
  }

  onSwitchPanel = () => {
    this.setState({
      editKey: !this.state.editKey
    });
  }

  onSaveClick = (e) => {
    this.updateProperty(APIKEY, this.state.inputKeyString);
    this.setState({
      editKey: !this.state.editKey,
      login: true
    });
  }

  onChangeInput = (e) => {
    this.setState({ inputKeyString: e.target.value });
  };

  onDisSwitchChange = (checked) => {
    this.setState({ discussEnabled: checked });
    this.updateProperty(DISCUSSION, checked);
  };

  onTagSwitchChange = (checked) => {
    this.setState({ tagEnabled: checked });
    this.updateProperty(TAG, checked);
  };

  onStatusSwitchChange = (checked) => {
    this.setState({ statusEnabled: checked });
    this.updateProperty(PMSTATUS, checked);
  };
  render() {
    const {editKey, login, inputKeyString} = this.state

    const apiKeyPanel = (
      <div className="app-apiKeyPanel">
        <Input className="app-input" placeholder={'Input Rally APIKey here'} defaultValue={inputKeyString} onChange={this.onChangeInput} />
        <Button className="app-submit" onClick={this.onSaveClick}> Save </Button>
      </div>
    )
    const editablePanel = (
      <div className="app-editablePanel">
        <div style={{ fontWeight: 'bold'}}>Editable Column</div>
        <div className="app-field">
          <span className="app-dis">Discussion</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultChecked={this.state.discussEnabled} onChange={this.onDisSwitchChange}/>
        </div>
        <div className="app-field">
          <span className="app-dis">Regression</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultunChecked />
        </div>
        <div className="app-field">
          <span className="app-dis">Iteration</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled' defaultunChecked />
        </div>
        <div className="app-field">
          <span className="app-dis">Tag</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled'  defaultChecked={this.state.tagEnabled} onChange={this.onTagSwitchChange}/>
        </div>
        <div className="app-field">
          <span className="app-dis">PM status</span>
          <Switch checkedChildren='Enabled' className="app-switch" unCheckedChildren='Disabled'  defaultChecked={this.state.statusEnabled} onChange={this.onStatusSwitchChange}/>
        </div>
      </div>
    )
    var loginPanel
    if(login) {
      loginPanel = (<Avatar style={{ backgroundColor: '#87d068'}} className="app-Avatar" icon="user" onClick={this.onSwitchPanel}/>
      )
    } else {
      loginPanel = (<Avatar icon="user" className="app-Avatar"/>)
    }
    if(editKey) {
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
