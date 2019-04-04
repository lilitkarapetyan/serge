import React, { Component } from 'react';
import '../scss/App.scss';
import { connect } from "react-redux";

import {
  getAllMessageTypes,
  createMessageType
} from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";

import { resetMessagePreview } from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import Link from "../Components/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faSave} from "@fortawesome/free-solid-svg-icons";
import SchemaEditor from "../Components/jsonSchemaEditor/index";
import {setSelectedSchema} from "../ActionsAndReducers/UmpireMenu/umpireMenu_ActionCreators";

class EditMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageList: this.props.messageTypes.messages, // set to state for filter, without filter don't set props to state to avoid bugs
      searchInput: '',
    };
  }


  componentWillMount() {
    this.props.dispatch(resetMessagePreview());
    this.props.dispatch(getAllMessageTypes());
  };


  componentWillReceiveProps(nextProps, nextContext) {

    if (this.props.messageTypes.messages.length !== nextProps.messageTypes.messages.length) {
      this.setState({
        messageList: nextProps.messageTypes.messages
      });
    }
  }


  saveSchema = () => {
    this.props.dispatch(createMessageType(this.props.umpireMenu.previewSchema));
  };

  render() {
    return (
      <div className="view-wrapper">
        <div id="sidebar">
          <Link href="/" id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>
        </div>
        <h1>Message template</h1>
        <div className="button-wrap">
          <span onClick={this.saveSchema} className="link"><FontAwesomeIcon icon={faSave} />Save Message</span>
        </div>
        <div className="flex-content-wrapper">
          <SchemaEditor />
        </div>
        <div className="button-wrap">
          <span onClick={this.saveSchema} className="link"><FontAwesomeIcon icon={faSave} />Save Message</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ messages, messageTypes, currentViewURI, umpireMenu }) => ({
  messages,
  messageTypes,
  currentViewURI,
  umpireMenu
});

export default connect(mapStateToProps)(EditMessage);