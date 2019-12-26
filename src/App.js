import React from 'react';
import logo from './ms_logo.png'
import {
  Switch,
  Avatar,
  Input,
  Button,
} from 'antd';

const rallyKey = 'Rally';
if (!localStorage.getItem(rallyKey)) {
  let rallyValue = {
    apiKey: '',
    defectFields: {}
  };
  localStorage.setItem(rallyKey, JSON.stringify(rallyValue));
}

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    const apiKey = this.getAPIKey();
    this.state = {
      editKey: !apiKey,
      login: !!apiKey,
      inputKeyString: apiKey
    };
  }

  getAPIKey = () => {
    const rallyValue = JSON.parse(localStorage.getItem(rallyKey));
    return rallyValue.apiKey;
  }

  updateAPIKey = (key) => {
    let rallyValue = JSON.parse(localStorage.getItem(rallyKey));
    rallyValue.apiKey = key;
    localStorage.setItem(rallyKey, JSON.stringify(rallyValue));
  }

  onSwitchPanel = () => {
    this.setState({
      editKey: !this.state.editKey
    });
  }

  onSaveClick = (e) => {
    this.updateAPIKey(this.state.inputKeyString);
    this.setState({
      editKey: !this.state.editKey,
      login: true
    });
  }

  onChangeInput = (e) => {
    this.setState({ inputKeyString: e.target.value });
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
