import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from "../Components/Link";

import moment from "moment";

import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { setOpenMessage } from "../ActionsAndReducers/setOpenMessage/setOpenMessage_ActionCreators";

import { getAllMessages, resetMessagePreview } from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import JsonEditor from "../Components/JsonCreator";
import SearchList from "../Components/SearchList";
// import { Edit, Duplicate, Delete } from "../ReusableLogic/editDuplicateDelete";
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
          return mes.doc.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });

        break;

      case 'library':
        newState = this.props.messages.messages.filter(function(mes) {
          return mes.doc.details.Title.toLowerCase().indexOf(value.toLowerCase()) > -1;
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


  // resetMessagePreviewId = () => {
  //   this.props.dispatch(resetMessagePreview());
  // };


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


  // bring into component..
  // --------
  createMessagePreview() {

    var printObject = (obj) => {

      let keyPropPairs = Object.entries(obj);

      return keyPropPairs.map((pair, i) => {
        if (typeof pair[1] === 'object') {
          printObject(pair[1]);
        }
        if (moment(pair[1], moment.ISO_8601, true).isValid()) {
          return <p key={`date${i}`}><b>{pair[0]}: </b>{moment(pair[1]).format('Do MMMM YYYY, h:mm:ss a')}</p>
        }


        return <p key={`${pair[0]}-${pair[1]}-${i}`}><b>{pair[0]}: </b>{pair[1]}</p>
      });
    };

    if (!this.props.messages.messagePreview.details) return false;

    let keyPropPairs = Object.entries(this.props.messages.messagePreview.details);

    return keyPropPairs.map((pair, i) => {
      if (i===0) {
        return <h2 key="title">{pair[1]}</h2>
      }

      if (moment(pair[1], moment.ISO_8601, true).isValid()) {
        return <p key={`date--${i}`}><b>{pair[0]}: </b>{moment(pair[1]).format('Do MMMM YYYY, h:mm:ss a')}</p>
      }

      if (typeof pair[1] === 'object') {
        return printObject(pair[1]);
      }

      return <p key={`info-${i}`}>{pair[0]}: {pair[1]}</p>
    });

    return false;
  }


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
              <JsonEditor id="preview" messageList={ this.props.messageTypes } curOpenMessageId={ this.props.curOpenMessageId } disabled={true} />
            :
              // show message in preview
              <div>
                 { this.createMessagePreview() }
              </div>
            }
          </div>
          <div id="function" className="flex-content flex-content--sml">
            <Link href={this.state.creatorType === 'templates' ? "/messageCreator/edit/template" : "/messageCreator/edit/message"}>Edit</Link>
            <Link href="/">Duplicate</Link>
            <Link href="/">Delete</Link>
          </div>
        </div>
      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ messageTypes, messages, curOpenMessageId, currentViewURI }) => ({
  messageTypes,
  messages,
  curOpenMessageId,
  currentViewURI
});

export default connect(mapStateToProps)(MessageUIContainer);