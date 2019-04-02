import React, { Component } from 'react';

import { connect } from "react-redux";

import {
  createMessage,
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

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";


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

    if (this.editor && this.props.createNew) {
      this.editor.destroy();
      this.editor = null;
    }

    if (
      nextProps.umpireMenu.selectedSchemaID.length > 0 &&
      nextProps.messageTypes &&
      nextProps.messageTypes.messages.length > 0
    ) {

      if (this.editor) return;

      this.editor = new JSONEditor(this.editorPreviewRef.current, {
        schema: nextProps.messageTypes.messages.find((mes) => mes._id === nextProps.umpireMenu.selectedSchemaID).details,
        theme: 'bootstrap4'
      });
    }

    if (
      nextProps.messages.messagePreviewId.length > 0 &&
      nextProps.messageTypes.messages.length > 0 &&
      !nextProps.disabled
    ) {

      const data = nextProps.messages.messages.find(function(mes) {
        return mes._id.toLowerCase().indexOf(nextProps.messages.messagePreviewId.toLowerCase()) > -1;
      });
      this.editor.setValue(data.details);
    }

    if (this.props.disabled) {
      this.editor.disable();
    }
  }


  saveMessage = () => {
    if (this.props.createNew) {
      this.props.dispatch(createMessage(this.editor.getValue(), this.props.umpireMenu.selectedSchemaID));
    } else {
      this.props.dispatch(updateMessage(this.editor.getValue(), this.props.messages.messagePreviewId));
    }
  };


  render() {
    return (
      <>
        <div className="button-wrap">
          {!this.props.disabled ? <span onClick={this.saveMessage} className="link"><FontAwesomeIcon icon={faSave} />Save Message</span> : null }
        </div>
          <div id="preview-editor" ref={this.editorPreviewRef}></div>
        <div className="button-wrap">
          {!this.props.disabled ? <span onClick={this.saveMessage} className="link"><FontAwesomeIcon icon={faSave} />Save Message</span> : null }
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