import React, { Component } from 'react';

import { connect } from "react-redux";

import {
  createMessage,
  resetMessagePreview,
  updateMessage
} from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import JSONEditor from '@json-editor/json-editor';
// import flatpickr from "flatpickr";
// for json.. datetime-local
// "flatpickr": {
//   "wrap": true,
//     "time_24hr": true,
//     "allowInput": true
// }
import '../scss/App.scss';
import {setSelectedSchema} from "../ActionsAndReducers/UmpireMenu/umpireMenu_ActionCreators";
import {setCurrentViewFromURI} from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_ActionCreators";

class JsonCreator extends Component {

  constructor(props) {
    super(props);

    this.editor = null;
    this.editorPreviewRef = React.createRef();

    this.state = {
      selectedSchema: ''
    };
  }

  createEditMessageEditor(nextProps) {

    const schemaId = nextProps.messages.messages.find((mes) => mes._id === nextProps.messages.messagePreviewId).schemaId;

    // HERE
    console.log(schemaId);

    this.editor = new JSONEditor(this.editorPreviewRef.current, {
      schema: nextProps.messageTypes.messages.find((mes) => mes._id === schemaId).details,
      theme: 'bootstrap4'
    });

    const data = nextProps.messages.messages.find(function(mes) {
      return mes._id.toLowerCase().indexOf(nextProps.messages.messagePreviewId.toLowerCase()) > -1;
    });

    this.editor.setValue(data.details);
  }


  componentWillUpdate(nextProps, nextState, nextContext) {

    if (this.editor) {
      this.editor.destroy();
    }

    if (nextProps.umpireMenu.currentOpenMessageSchemaID.length > 0) {

      this.editor = new JSONEditor(this.editorPreviewRef.current, {
        // schema: this.props.messageList.find((mes) => mes.id === nextProps.umpireMenu.currentOpenMessageSchemaID).doc.details,
        schema: nextProps.messageTypes.messages.find((mes) => mes._id === nextProps.umpireMenu.currentOpenMessageSchemaID).details,
        theme: 'bootstrap4'
      });
    }

    if (
      nextProps.messages.messagePreviewId.length > 0 &&
      nextProps.messageTypes.messages.length > 0 &&
      !nextProps.disabled
    ) {
      this.createEditMessageEditor(nextProps);
    }

    if (this.props.disabled) {
      this.editor.disable();
    }

    const selectedSchema = nextProps.messageTypes.messages.find((mes) => mes._id === nextProps.umpireMenu.currentOpenMessageSchemaID);

    if (!selectedSchema) return false;

    // will loop and crash app if constantly calling dispatch within componentWillUpdate
    if (selectedSchema._id !== nextProps.umpireMenu.selectedSchemaID) {
      this.props.dispatch(setSelectedSchema(selectedSchema._id));
    }
  }


  saveMessage = () => {
    if (this.props.createNew) {
      this.props.dispatch(createMessage(this.editor.getValue(), this.props.umpireMenu.selectedSchemaID));
    } else {
      this.props.dispatch(updateMessage(this.editor.getValue(), this.props.messages.messagePreviewId));
    }
    this.props.dispatch(resetMessagePreview());
    window.history.pushState({}, '', '/umpireMenu/library');
    this.props.dispatch(setCurrentViewFromURI('/umpireMenu/library'));
  };


  render() {
    return (
      <>
        <div className="button-wrap">
          {!this.props.disabled ? <h2 onClick={this.saveMessage}>Save Message</h2> : null }
        </div>
          <div id="preview-editor" ref={this.editorPreviewRef}></div>
        <div className="button-wrap">
          {!this.props.disabled ? <h2 onClick={this.saveMessage}>Save Message</h2> : null }
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ messages, messageTypes, selectedSchema, umpireMenu }) => ({
  messages,
  messageTypes,
  selectedSchema,
  umpireMenu
});

export default connect(mapStateToProps)(JsonCreator);