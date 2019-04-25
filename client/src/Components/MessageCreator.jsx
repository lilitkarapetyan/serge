import React, { Component } from 'react';

import { connect } from "react-redux";
import _ from "lodash";

import JSONEditor from '@json-editor/json-editor';
import '../scss/App.scss';

import {
  saveMessage,
  getAllMessages,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faSave} from "@fortawesome/free-solid-svg-icons";


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

    // let forces = this.props.playerUi.allChannels[this.props.playerUi.selectedChannel];
    // let templates = _.uniqBy(_.flatMap(forces, (force) => force.templates), _.isEqual);
    // templates = templates.map((item) => item.value);

    let messageDetails = {
      channel: this.props.playerUi.selectedChannel,
      from: {
        force: this.props.playerUi.selectedForce,
        role: this.props.selectedRole,
      },
    };

    this.props.dispatch(saveMessage(this.props.playerUi.currentWargame, messageDetails, this.editor.getValue()));
    this.props.dispatch(getAllMessages());
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
          theme: 'bootstrap4'
        });
    }
  }


  render() {
    return (
      <>
        <div id="preview-editor" ref={this.editorPreviewRef}></div>
        <button name="send" className="btn btn-action btn-action--primary" onClick={this.sendMessage}>Send</button>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi
});

export default connect(mapStateToProps)(JsonCreator);
