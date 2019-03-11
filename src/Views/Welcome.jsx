import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-virtualized-select';
// Import default styles.
// This only needs to be done once; probably during bootstrapping process.
import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";

import { createDBMessage } from "../ActionsAndReducers/pouchDb/pouchDb_ActionCreators.jsx";

import "../scss/App.scss";

class Welcome extends Component {

  constructor(props) {

    super(props);

    this.selectOptions = [
      { value: "red", label: "Red" },
      { value: "green", label: "Green" },
      { value: "blue", label: "Blue" }
    ];

    this.state = {
      selectedOptionFrom: null,
      selectedOptionTo: null,
    }
  };

  onMessageChange = () => {
    this.setState({
      message: this.refs.usernameInput.value
    });
  };

  onChangeFrom = (selectedOption) => {
    this.setState({selectedOptionFrom: selectedOption.value})
  };

  onChangeTo = (selectedOption) => {
    this.setState({selectedOptionTo: selectedOption.value})
  };

  createMessage = () => {
    let message = {
      message: this.state.message,
      from: this.state.selectedOptionFrom,
      to: this.state.selectedOptionTo,
    };

    this.props.dispatch(createDBMessage(message));
  };

  render() {
    return (
      <div className="flex-content-wrapper">
        <div className="flex-content flex-content--50">
          <Select
            value={this.state.selectedOptionFrom}
            onChange={this.onChangeFrom}
            options={this.selectOptions}
            placeholder="Select player"
          />
          <Select
            value={this.state.selectedOptionTo}
            onChange={this.onChangeTo}
            options={this.selectOptions}
            placeholder="Select player"
          />
          <input ref="usernameInput" onChange={this.onMessageChange} placeholder="Message" type="text" />
          <button onClick={this.createMessage}>Add message</button>
        </div>
        <div  className="flex-content flex-content--50">
          <h2>Messages</h2>
          <div id="messages">
            {
              this.props.allMessages.messages.map(function(message, i) {
                console.log(message);
                return (<div className="single-message" key={`single-message--${i}`}>
                  <h5>{message.id}</h5>
                  <p>FROM: {message.doc.details.from}</p>
                  <p>TO: {message.doc.details.to}</p>
                  <p>{message.doc.details.message}</p>
                </div>)
              })
            }
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = ({messageSendStatus, allMessages}) => ({
  messageSendStatus: messageSendStatus,
  allMessages: allMessages
});

export default connect(mapStateToProps)(Welcome);