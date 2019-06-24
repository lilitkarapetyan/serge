import React, { Component } from 'react';

import { connect } from "react-redux";

import JSONEditor from '@json-editor/json-editor';
import '../scss/App.scss';

import {
  saveMessage,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import {
  faUserSecret
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class JsonCreator extends Component {

  constructor(props) {
    super(props);

    this.editor = null;
    this.editorPreviewRef = React.createRef();
    this.privateMessageRef = React.createRef();


    this.state = {
      selectedSchema: ''
    };
  }

  sendMessage = () => {

    let curForce = this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce);

    let details = {
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

    if (this.props.privateMessage) {
      details.privateMessage = this.privateMessageRef.current.value;
      this.privateMessageRef.current.value = "";
    }

    this.props.dispatch(saveMessage(this.props.playerUi.currentWargame, details, this.editor.getValue()));

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
      schema: schema,
      theme: 'bootstrap4',
      disable_collapse: true,
      disable_edit_json: true,
      disable_properties: true,
    });
  }

  render() {
    return (
      <>
        <div id="message-creator" ref={this.editorPreviewRef}></div>
        {
          this.props.privateMessage && (
            <div className="flex-content">
              <label htmlFor="" className="material-label" id="private-message-input-label"><FontAwesomeIcon size="2x" icon={faUserSecret}/>Private message</label>
              <textarea id="private-message-input" className="material-input" ref={this.privateMessageRef} />
            </div>
          )
        }
        <button name="send" className="btn btn-action btn-action--primary" onClick={this.sendMessage}>Send</button>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi
});

export default connect(mapStateToProps)(JsonCreator);
