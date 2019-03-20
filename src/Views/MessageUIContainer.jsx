import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { setOpenMessage } from "../ActionsAndReducers/setOpenMessage/setOpenMessage_ActionCreators";

import JsonEditor from "../Components/JsonEditor";
// import SearchList from "../Components/SearchList";

import '../scss/App.scss';

class MessageUIContainer extends Component {

  constructor(props) {
    super(props);

    // HACK
    this.state = {
      creatorType: this.props.match.params ? this.props.match.params.creatorType : '',
      // messageTypes: this.props.messageTypes.messages, // for page navigation
    };
    if (this.props.match.params) {
      this.buildMessageBoard();
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
        this.props.dispatch(getAllMessageTypes());
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

    var newState = this.props.messageTypes.messages.filter(function(mes) {
      return mes.doc.title.toLowerCase().indexOf(input.target.value.toLowerCase()) > -1;
    });

    console.log(newState);

    this.setState({
      messageTypes: newState
    });
  };

  createSelectionSection() {

    var that = this;

    switch (this.state.creatorType) {

      case 'templates':

        return [
          <Link to="/messageCreator/createTemplate" key="templates">Create new template</Link>,
          <input type="text" className="search" key="search-templates" placeholder={`Search ${this.state.creatorType}`} onChange={ this.filterMessages } />
          ].concat(this.props.messageTypes.messages.map(function(item) {
            return <a href="#" onClick={that.setOpenMessageId.bind(that, item.doc._id)} key={item.doc._id}>{item.doc.title}</a>
          }));

        // remove href="#" later replace with stylised span
        // componentise - bug found in react-router same sub component different views changing path rerenders constructor

      case 'library':
        // needs messages not messageTypes once added
        return [ <Link key="messages" to="/messageCreator/createMessage">Create new Message</Link>,
            <input type="text" className="search" key="search-templates" placeholder={`Search ${this.state.creatorType}`} onChange={ this.filterMessages } />
          ].concat(this.props.messageTypes.messages.map(function(item) {
            return <a href="#" onClick={that.setOpenMessageId.bind(that, item.doc._id)} key={item.doc._id}>{item.doc.title}</a>
          }));

      default:
        // throw developer an error
        console.log('wrong creatorType');
        throw new TypeError('wrong creatorType on Link');

    }
  }


  render() {
    return (
      <div className="view-wrapper">
        <h1>Message {this.state.creatorType}</h1>
        <div className="flex-content-wrapper">
          <div id="selection" className="flex-content">
            { this.createSelectionSection() }
          </div>
          <div id="preview" className="flex-content flex-content--big">
            <p>Preview</p>
            <JsonEditor id="preview" messageTypes={ this.props.messageTypes } curOpenMessageId={ this.props.curOpenMessageId } />
          </div>
          <div id="function" className="flex-content flex-content--sml">
            <Link to={this.state.creatorType === 'template' ? "/messageCreator/editTemplate" : "/messageCreator/editMessage"}>Edit</Link>
            <Link to="/">Duplicate</Link>
            <Link to="/">Delete</Link>
          </div>
        </div>
      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ messageTypes, curOpenMessageId }) => ({
  messageTypes,
  curOpenMessageId
});

export default connect(mapStateToProps)(MessageUIContainer);