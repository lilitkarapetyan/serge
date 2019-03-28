import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-virtualized-select';
// Import default styles.
// This only needs to be done once; probably during bootstrapping process.
// import "react-select/dist/react-select.css";
// import "react-virtualized-select/styles.css";

import { createMessage, getAllMessages } from "../ActionsAndReducers/pouchDb/pouchDb_ActionCreators.jsx";

import "../scss/App.scss";

class MessageTests extends Component {

  constructor(props) {

    super(props);

    this.selectOptions = [
      { value: "Red", label: "Red" },
      { value: "Green", label: "Green" },
      { value: "Blue", label: "Blue" }
    ];

    this.state = {
      selectedOptionFrom: null,
      selectedOptionTo: null,
    }
  };

  componentWillMount() {
    this.props.dispatch(getAllMessages());
  }

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

    this.props.dispatch(createMessage(message));
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
        <div className="flex-content flex-content--50">
          <h2>Messages</h2>
          <div id="messages">
            {
              this.props.allMessages.messages.map(function(message, i) {

                return (<div className="single-message" key={`single-message--${i}`}>
                  <h4>{new Date(message.id).toLocaleTimeString()}</h4>
                  <h5>{new Date(message.id).toDateString()}</h5>
                  <span>FROM:{message.doc.details.from}</span>
                  <span>TO:{message.doc.details.to}</span>
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

export default connect(mapStateToProps)(MessageTests);