import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeUsername} from "../ActionsAndReducers/Username/Username_ActionCreators";
import {getTestJson} from "../ActionsAndReducers/TestAsync/Async_ActionCreators";
import {getBackendData} from "../ActionsAndReducers/TestBackend/Backend_ActionCreators";
import "../scss/App.scss";

// import _ from 'underscore';

class Welcome extends Component {

  constructor(props) {
    super(props);
    // bind each event function to keep this context
    this.onUsernameInputChange = this.onUsernameInputChange.bind(this);
    this.getTest = this.getTest.bind(this);
    // ~~
  }

  onUsernameInputChange() {
    clearTimeout(this.delayedExecution);
    this.delayedExecution = setTimeout(() => {
      this.props.dispatch(changeUsername(this.refs.usernameInput.value))
    }, 500);
  }

  getTest() {
    this.props.dispatch(getBackendData());
  }

  render() {
    return (
      <div>
        <button onClick={this.getTest}>TEST</button>
        <h1>Hello <input ref="usernameInput" onChange={this.onUsernameInputChange} defaultValue={this.props.username} type="text" />, and Hello World!</h1>
      </div>
    );
  }
};

const mapStateToProps = ({updateName}) => ({
  username: updateName
});

export default connect(mapStateToProps)(Welcome);