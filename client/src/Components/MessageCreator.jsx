import React, { Component } from 'react';

import { connect } from "react-redux";

import JSONEditor from '@json-editor/json-editor';
import '../scss/App.scss';

import {
  saveMessage,
  getAllWargameMessages,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

class JsonCreator extends Component {

  constructor(props) {
    super(props);

    this.editor = null;
    this.editorPreviewRef = React.createRef();

    this.state = {
      selectedSchema: ''
    };
  }

  sendMessage = () => {

    let messageDetails = {
      channel: this.props.playerUi.selectedChannel,
      from: {
        force: this.props.playerUi.selectedForce,
        role: this.props.playerUi.selectedRole,
        icon: this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce).icon,
      },
      messageType: this.props.playerUi.messageSchema.title,
    };

    this.props.dispatch(saveMessage(this.props.playerUi.currentWargame, messageDetails, this.editor.getValue()));
    this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    if (nextProps.schema && nextProps.schema.type) {
        if (this.editor) return;

      this.editor = new JSONEditor(this.editorPreviewRef.current, {
        schema: nextProps.schema,
        theme: 'bootstrap4',
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
      });
    }
  }


  render() {
    return (
      <>
        <div id="message-creator" ref={this.editorPreviewRef}></div>
        <button name="send" className="btn btn-action btn-action--primary" onClick={this.sendMessage}>Send</button>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi
});

export default connect(mapStateToProps)(JsonCreator);
