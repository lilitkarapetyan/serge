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
      channel: this.props.curChannel,
      from: {
        force: curForce.name,
        forceColor: this.props.playerUi.forceColor,
        role: this.props.playerUi.selectedRole,
        icon: curForce.icon,
      },
      messageType: this.props.schema.title,
      timestamp: new Date().toISOString(),
    };

    this.props.dispatch(saveMessage(this.props.playerUi.currentWargame, messageDetails, this.editor.getValue()));

    this.editor.destroy();
    this.editor = null;
    this.createEditor(this.props.schema);
  };

  componentWillReceiveProps(nextProps, nextContext) {

    if (
      this.props.schema &&
      this.props.schema.title !== nextProps.schema.title
    ) {
      this.editor.destroy();
      this.editor = null;
    }

    if (nextProps.schema && nextProps.schema.type) {
      if (this.editor) return;
      this.createEditor(nextProps.schema);
    }
  }

  createEditor(schema) {
    this.editor = new JSONEditor(this.editorPreviewRef.current, {
      schema,
      theme: 'bootstrap4',
      disable_collapse: true,
      disable_edit_json: true,
      disable_properties: true,
    });
  }

  render() {
    return (
      <>
        <div className="form-group" id="message-creator" ref={this.editorPreviewRef}></div>
        <div className="form-group">
          <button name="send" className="btn btn-action btn-action--form" onClick={this.sendMessage}>
            <span>Send Message</span>
          </button>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi
});

export default connect(mapStateToProps)(JsonCreator);
