import React, { Component } from 'react';

import { connect } from "react-redux";

import JSONEditor from '@json-editor/json-editor';
import '../scss/App.scss';

import {
  saveMessage,
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

    let curForce = this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce);

    let messageDetails = {
      channel: this.props.playerUi.chatChannel.name,
      from: {
        force: curForce.name,
        forceColor: this.props.playerUi.forceColor,
        role: this.props.playerUi.selectedRole,
        icon: curForce.icon,
      },
      messageType: this.props.schema.title,
      timestamp: new Date().toISOString(),
    };

    if (this.editor.getValue().content === "") return;

    this.props.dispatch(saveMessage(this.props.playerUi.currentWargame, messageDetails, this.editor.getValue()));
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
      <div className="media">
        <div className="media-body" id="message-creator" ref={this.editorPreviewRef}></div>
        <div className="align-self-center">
          <button name="send" className="btn btn-action btn-action--complimentary" onClick={this.sendMessage}>
            <span className="sr-only">Send</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi
});

export default connect(mapStateToProps)(JsonCreator);
