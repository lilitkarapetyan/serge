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

    let forces = this.props.wargame.allChannels[this.props.wargame.selectedChannel];
    let templates = _.uniqBy(_.flatMap(forces, (force) => force.templates), _.isEqual);
    templates = templates.map((item) => item.value);

    let to = this.props.wargame.allChannels[this.props.wargame.selectedChannel].map((item) => item.force);
    let from = this.props.wargame.selectedForce;

    this.props.dispatch(saveMessage(this.props.wargame.currentWargame, {templates, to, from}, this.editor.getValue()));
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

const mapStateToProps = ({ wargame }) => ({
  wargame
});

export default connect(mapStateToProps)(JsonCreator);
