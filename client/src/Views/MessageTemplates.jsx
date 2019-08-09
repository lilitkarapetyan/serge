import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from "../Components/Link";

import {
  getAllMessageTypes,
  duplicateMessageType,
} from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";

import {
  duplicateMessage,
} from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import { modalAction } from "../ActionsAndReducers/Modal/Modal_ActionCreators";


import JsonCreator from "../Components/JsonCreator";
import '../scss/App.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faClone, faTrash,faPlus} from "@fortawesome/free-solid-svg-icons";
import SearchList from "../Components/SearchList";
import {setSelectedSchema} from "../ActionsAndReducers/UmpireMenu/umpireMenu_ActionCreators";
import {
  ADMIN_ROUTE,
  CREATE_TEMPLATE_ROUTE,
  EDIT_TEMPLATE_ROUTE,
  MESSAGE_CREATOR_BASE_ROUTE, MESSAGE_LIBRARY_ROUTE, MESSAGE_TEMPLATE_ROUTE, WELCOME_SCREEN_EDIT_ROUTE
} from "../consts";

class MessageTemplates extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      messageList: this.props.messageTypes.messages,
    };

    this.props.dispatch(getAllMessageTypes());
  }

  componentWillMount() {
    this.props.dispatch(setSelectedSchema(""));
  };

  componentWillReceiveProps(nextProps, nextContext) {

    if (this.state.searchQuery.length === 0) {
      // only on page load
      this.setState({
        messageList: nextProps.messageTypes.messages,
      });
    }
  }


  setSelectedSchemaId = (item) => {
    this.props.dispatch(setSelectedSchema(item._id));
  };


  // event listener functions from the DOM will lose scope of this to the React Class unless stated as an arrow function
  // or this is bound to them within the constructor like.. this.filterMessages = this.filterMessages.bind(this);
  // arrow functions are es6 syntax and preferable if babel compiler can compile them. - They have the scope of where they're
  // defined unlike a normal function that has it's own scope.
  filterMessages = (input) => {

    let value = input ? input.target.value : this.state.searchQuery;

    let filteredMessages = this.props.messageTypes.messages.filter(function(mes) {
        return mes.details.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });

    this.setState({
      messageList: filteredMessages,
      searchQuery: value
    });
  };


  createSearchListSection() {
      return [
          <Link href={`${MESSAGE_CREATOR_BASE_ROUTE}${CREATE_TEMPLATE_ROUTE}`}key="templates" class="link"><FontAwesomeIcon icon={faPlus} />Create new template</Link>,
          <SearchList key="searchlist"
                      listData={this.state.messageList}
                      searchQuery={this.state.searchQuery}
                      filter={this.filterMessages}
                      selected={this.props.umpireMenu.selectedSchemaID}
                      setSelected={this.setSelectedSchemaId}
                      placeholder={'Select template'}
          />
      ];
  }

  createTemplatesActions() {
    return this.props.umpireMenu.selectedSchemaID.length > 0 ?
      <>
        <Link class="link link--secondary" href={`${MESSAGE_CREATOR_BASE_ROUTE}${EDIT_TEMPLATE_ROUTE}`}><FontAwesomeIcon icon={faPencilAlt} />Edit</Link>
        <span className="link link--secondary" onClick={this.duplicateTemplate}><FontAwesomeIcon icon={faClone} />Duplicate</span>
        <span className="link link--secondary" onClick={this.deleteTemplate}><FontAwesomeIcon icon={faTrash} />Delete</span>
      </>
      :
      null;
  };


  duplicateTemplate = () => {
    this.props.dispatch(duplicateMessageType(this.props.umpireMenu.selectedSchemaID))
  };


  deleteTemplate = () => {
    this.props.dispatch(modalAction.open("delete"));
  };


  duplicateMessage = () => {
    this.props.dispatch(duplicateMessage(this.props.messages.messagePreviewId));
  };


  deleteMessage = () => {
    this.props.dispatch(modalAction.open("delete"));
  };


  render() {
    return (
      <div className="view-wrapper" id="umpire">
        <div id="sidebar_admin">
          {/*<Link href={BASE_ROUTE} id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>*/}
          <Link href={ADMIN_ROUTE} class="link link--large">Games</Link>
          <Link href={MESSAGE_TEMPLATE_ROUTE} class="link link--large link--active">Message Templates</Link>
          <Link href={MESSAGE_LIBRARY_ROUTE} class="link link--large">Message Library</Link>
          <Link href={WELCOME_SCREEN_EDIT_ROUTE} class="link link--large">Welcome Screen</Link>
        </div>
        <h1>Message Templates</h1>
        <div className="flex-content-wrapper">
          <div id="selection" className="flex-content">
            { this.createSearchListSection() }
          </div>
          <div id="preview" className="flex-content flex-content--big">
            <p className="heading--sml">Preview</p>
            <JsonCreator id="preview"
                         disabled={true}
                         previewForm={true}
            />
          </div>
          <div id="function" className="flex-content flex-content--sml">
            <p className="heading--sml">Actions</p>
              {this.createTemplatesActions()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ messageTypes, umpireMenu }) => ({
  messageTypes,
  umpireMenu
});

export default connect(mapStateToProps)(MessageTemplates);
