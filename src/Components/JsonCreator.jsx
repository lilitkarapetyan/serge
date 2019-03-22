import React, { Component } from 'react';

import { connect } from "react-redux";

import { createMessage } from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import JSONEditor from '@json-editor/json-editor';
// import flatpickr from "flatpickr";
// for json.. datetime-local
// "flatpickr": {
//   "wrap": true,
//     "time_24hr": true,
//     "allowInput": true
// }
import '../scss/App.scss';

class JsonCreator extends Component {

  constructor(props) {
    super(props);

    this.editor = null;
    this.editorPreviewRef = React.createRef();

    this.state = {
      selectedSchema: ''
    };

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

      if (this.state.selectedSchema !== nextState.selectedSchema) {
        this.setState({
          selectedSchema: nextProps.messageTypes.messages.find((mes) => mes.id === nextProps.curOpenMessageId).id
        });
      }
    }

    if (nextProps.messages.messagePreviewId.length > 0 && nextProps.edit) {

      this.editor = new JSONEditor(this.editorPreviewRef.current, {
        schema: nextProps.messageList.find((mes) => mes.id === nextProps.messages.messagePreviewId),
        theme: 'bootstrap4'
      });

      const data = nextProps.messages.messages.filter(function(mes) {
        return mes.doc._id.toLowerCase().indexOf(nextProps.messages.messagePreviewId.toLowerCase()) > -1;
      });
      console.log(data);
      this.editor.setValue(data);
    }

    if (this.props.disabled) {
      this.editor.disable();
    }
  }


  saveMessage = () => {
    this.props.dispatch(createMessage(this.editor.getValue(), this.state.selectedSchema));
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

const mapStateToProps = ({ messages, messageTypes, curOpenMessageId, currentViewURI }) => ({
  messages,
  // messageTypes,
  curOpenMessageId,
  currentViewURI,
});

export default connect(mapStateToProps)(JsonCreator);