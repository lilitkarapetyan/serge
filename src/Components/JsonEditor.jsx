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

  }

  componentWillUpdate(nextProps, nextState, nextContext) {

    if (this.editor) {
      this.editor.destroy();
    }

    if (nextProps.umpireMenu.currentOpenMessageSchemaID.length > 0) {
      this.editor = new JSONEditor(this.editorPreviewRef.current, {
        schema: this.props.messageList.messages.find((mes) => mes.id === nextProps.umpireMenu.currentOpenMessageSchemaID).doc.details,
        theme: 'bootstrap4'
      });

      if (this.props.disabled) {
        this.editor.disable();
      }
    } else {
      if (this.editor) {
        this.editor.destroy();
      }
    }
  }


  saveMessage = () => {
    this.props.dispatch(createMessage(this.editor.getValue()));
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

const mapStateToProps = ({ messageTypes, umpireMenu }) => ({
  messageTypes,
  umpireMenu,
});

export default connect(mapStateToProps)(JsonCreator);