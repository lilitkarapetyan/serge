import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from "../Components/Link";

import moment from "moment";
import check from "check-types";

import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { setOpenMessage } from "../ActionsAndReducers/UmpireMenu/umpireMenu_ActionCreators";
import { getAllMessages, resetMessagePreview, duplicateMessage } from "../ActionsAndReducers/dbMessages/messages_ActionCreators";
import { modalAction } from "../ActionsAndReducers/Modal/Modal_ActionCreators";


import JsonEditor from "../Components/JsonCreator";
import SearchList from "../Components/SearchList";
import MessagePreview from "../Components/MessagePreview";
import '../scss/App.scss';

class MessageUIContainer extends Component {

  constructor(props) {
    super(props);

    let creatorType = this.props.currentViewURI.split('/')[2];

    this.state = {
      searchInput: '',
      creatorType: creatorType,
      messageList: creatorType === 'templates' ? this.props.messageTypes.messages : this.props.messages.messages,
    };

    this.buildMessageBoard();
  }

  componentWillReceiveProps(nextProps, nextContext) {

    if (this.state.searchInput.length === 0) {
      // only on page load
      this.setState({
        messageList: this.state.creatorType === 'templates' ? nextProps.messageTypes.messages : nextProps.messages.messages,
      });
    }
  }

  componentWillMount() {
    //..needed? - re-evaluate
    this.props.dispatch(setOpenMessage(''));
  }

  buildMessageBoard() {

    switch (this.state.creatorType) {

      case 'templates':
        // get template data action
        this.props.dispatch(getAllMessageTypes());
        break;

      case 'library':
        // get library data action
        this.props.dispatch(getAllMessages());
        break;

      default:
        // throw developer an error
        break;
    }
  }


  setOpenMessageId(id) {
    this.props.dispatch(setOpenMessage(id));
  }


  // event listener functions from the DOM will lose scope of this to the React Class unless stated as an arrow function
  // or this is bound to them within the constructor like.. this.filterMessages = this.filterMessages.bind(this);
  // arrow functions are es6 syntax and preferable if babel compiler can compile them. - They have the scope of where they're
  // defined unlike a normal function that has it's own scope.
  filterMessages = (input) => {

    let value = input.target.value;

    let newState;

    switch (this.state.creatorType) {
      case 'templates':
        newState = this.props.messageTypes.messages.filter(function(mes) {
          return mes.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });

        break;

      case 'library':
        newState = this.props.messages.messages.filter(function(mes) {
          return mes.details.Title.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });
        break;

      default:
        newState = [];
        break;
    }

    this.setState({
      messageList: newState,
      searchInput: value.toLowerCase()
    });
  };


  createSearchListSection() {

    var that = this;

    switch (this.state.creatorType) {

      case 'templates':

        return [
            <Link href="/messageCreator/create/template" key="templates">Create new template</Link>,
            <SearchList key="searchlist"
                        creatorType={ this.state.creatorType }
                        messageList={ this.state.messageList }
                        filterMessages={ this.filterMessages }
                        searchInput={ this.state.searchInput }
            />,
        ];

      case 'library':

        return [
            <Link href="/messageCreator/create/message" key="messages">Create new Message</Link>,
            <SearchList key="searchlist"
                        creatorType={ this.state.creatorType }
                        messageList={ this.state.messageList }
                        filterMessages={ this.filterMessages }
                        searchInput={ this.state.searchInput }
            />
        ];

      default:
        break;
    }
  }


  duplicateMessage = () => {

    this.props.dispatch(duplicateMessage(this.props.messages.messagePreviewId));

  };

  deleteMessage = () => {

    this.props.dispatch(modalAction.open());

  };


  render() {
    return (
      <div className="view-wrapper">
        <h1>Message {this.state.creatorType}</h1>
        <div className="flex-content-wrapper">
          <div id="selection" className="flex-content">
            { this.createSearchListSection() }
          </div>
          <div id="preview" className="flex-content flex-content--big">
            <p>Preview</p>
            { this.state.creatorType === 'templates' ?
              <JsonEditor id="preview"
                          messageList={ this.props.messageTypes }
                          // currentOpenMessageSchemaID={ this.props.umpireMenu.currentOpenMessageSchemaID }
                          disabled={true} />
            :
              <div id="message-preview">
                <MessagePreview detail={this.props.messages.messagePreview.details} />
              </div>
            }
          </div>
          <div id="function" className="flex-content flex-content--sml">
            <Link href={this.state.creatorType === 'templates' ? "/messageCreator/edit/template" : "/messageCreator/edit/message"}>Edit</Link>
            <span onClick={this.duplicateMessage}>Duplicate</span>
            <span onClick={this.deleteMessage}>Delete</span>
          </div>
        </div>
      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ messageTypes, messages, currentViewURI, umpireMenu }) => ({
  messageTypes,
  messages,
  currentViewURI,
  umpireMenu
});

export default connect(mapStateToProps)(MessageUIContainer);