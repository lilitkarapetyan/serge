import React, {Component} from 'react';
import {connect} from 'react-redux';
import { exampleAction } from "../ActionsAndReducers/TestNormal/Example_ActionCreators";
import { getTestJson } from "../ActionsAndReducers/ExampleAsync/Async_ActionCreators";
import "../scss/App.scss";

class Welcome extends Component {

  constructor(props) {
    super(props);
  }

  onUsernameInputChange = () => {
    clearTimeout(this.delayedExecution);
    this.delayedExecution = setTimeout(() => {
      this.props.dispatch(exampleAction(this.refs.usernameInput.value))
    }, 500);
  };

  getTestJson = () => {
    this.props.dispatch(getTestJson());
  };

  render() {
    return (
      <div>
        <button onClick={this.getTestJson}>TEST</button>
        <h1>Hello <input ref="usernameInput" onChange={this.onUsernameInputChange} defaultValue={this.props.username} type="text" />, and Hello World!</h1>
      </div>
    );
  }
};

const mapStateToProps = ({updateName}) => ({
  username: updateName
});

export default connect(mapStateToProps)(Welcome);