import React, { Component } from 'react';

import { connect } from "react-redux";

import { createMessage, updateMessage } from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import JSONEditor from '@json-editor/json-editor';
// import flatpickr from "flatpickr";
// for json.. datetime-local
// "flatpickr": {
//   "wrap": true,
//     "time_24hr": true,
//     "allowInput": true
// }
import '../scss/App.scss';
import {setSelectedSchema} from "../ActionsAndReducers/selectedSchema/selectedSchema_ActionCreators";

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
    const schemaId = nextProps.messages.messages.find((mes) => mes.id === nextProps.messages.messagePreviewId).doc.schemaId;

    console.log(nextProps.messages);

    this.editor = new JSONEditor(this.editorPreviewRef.current, {
      schema: nextProps.messageTypes.messages.find((mes) => mes.id === schemaId).doc.details,
      theme: 'bootstrap4'
    });

    const data = nextProps.messages.messages.find(function(mes) {
      return mes.doc._id.toLowerCase().indexOf(nextProps.messages.messagePreviewId.toLowerCase()) > -1;
    });

    this.editor.setValue(data.doc.details);
  }


  componentWillUpdate(nextProps, nextState, nextContext) {

    if (this.editor) {
      this.editor.destroy();
    }

    if (nextProps.curOpenMessageId.length > 0) {

      this.editor = new JSONEditor(this.editorPreviewRef.current, {
        // schema: this.props.messageList.find((mes) => mes.id === nextProps.curOpenMessageId).doc.details,
        schema: nextProps.messageTypes.messages.find((mes) => mes.id === nextProps.curOpenMessageId).doc.details,
        theme: 'bootstrap4'
      });
    }

    if (
      nextProps.messages.messagePreviewId.length > 0 &&
      nextProps.messageTypes.messages.length > 0 &&
      nextProps.edit
    ) {
      this.createEditMessageEditor(nextProps);
    }

    if (this.props.disabled) {
      this.editor.disable();
    }

    const selectedSchema = nextProps.messageTypes.messages.find((mes) => mes.id === nextProps.curOpenMessageId);

    if (!selectedSchema) return false;

    if (selectedSchema.id !== nextProps.selectedSchema) {
      this.props.dispatch(setSelectedSchema(selectedSchema.id));
    }
  }


  saveMessage = () => {
    if (this.props.edit) {
      this.props.dispatch(updateMessage(this.editor.getValue(), this.props.messages.messagePreviewId, this.props.selectedSchema));
    } else {
      this.props.dispatch(createMessage(this.editor.getValue(), this.props.selectedSchema));
    }
  };


  render() {
    return (
      <>
        {!this.props.disabled ? <h2 onClick={this.saveMessage}>Save Message</h2> : null }
          <div id="editor-preview" ref={this.editorPreviewRef}></div>
        {!this.props.disabled ? <h2 onClick={this.saveMessage}>Save Message</h2> : null }
      </>
    );
  }
}

const mapStateToProps = ({ messages, messageTypes, curOpenMessageId, currentViewURI, selectedSchema }) => ({
  messages,
  messageTypes,
  curOpenMessageId,
  currentViewURI,
  selectedSchema
});

export default connect(mapStateToProps)(JsonCreator);