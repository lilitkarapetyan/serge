import React, { Component } from 'react';
// import ReactDOM from "react-dom";
import '../scss/App.scss';
import { connect } from "react-redux";

import JsonCreator from "../Components/JsonCreator";

import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { resetMessagePreview } from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import Link from "../Components/Link";
import SearchList from "../Components/SearchList";
import {setCurrentViewFromURI} from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_ActionCreators";

class EditMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageToEdit: this.props.messages.messagePreviewId,
      messageList: this.props.messages.messages, // set to state for filter, without filter don't set props to state to avoid bugs
      searchInput: '',
    };
  }

  componentWillMount() {
    this.props.dispatch(getAllMessageTypes());
  }



  componentWillReceiveProps(nextProps, nextContext) {

    if (this.props.messages.messages.length !== nextProps.messages.messages.length) {
      this.setState({
        messageToEdit: nextProps.messages.messagePreviewId,
        messageList:  nextProps.messages.messages
      });
    }
  }

  filterMessages = (input) => {

    let value = input.target.value;

    let newState = this.props.messages.messages.filter(function(mes) {
      return mes.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });

    this.setState({
      messageList: newState,
      searchInput: value.toLowerCase()
    });
  };

  render() {

    return (
      <div className="view-wrapper">
        <Link href="/">Home</Link>
        <h1>Message library</h1>
        <div className="flex-content-wrapper">
          <div id="selection" className="flex-content">
            {/*<SearchList className="search"*/}
                        {/*key="search-templates"*/}
                        {/*messageList={ this.state.messageList }*/}
                        {/*filterMessages={ this.filterMessages }*/}
                        {/*searchInput={ this.state.searchInput }*/}
                        {/*placeholder={ 'Select template' }*/}
            {/*/>*/}
          </div>
          <div id="preview" className="flex-content flex-content--big">
            <JsonCreator id="preview"
                         disabled={ false }
                         edit={ true }
                         // messageList={this.props.messageTypes}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ messages, messageTypes }) => ({
  messages,
  messageTypes
});

export default connect(mapStateToProps)(EditMessage);