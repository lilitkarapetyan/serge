import React, { Component } from 'react';
// import ReactDOM from "react-dom";
import '../scss/App.scss';
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import JSONEditor from '@json-editor/json-editor';

class EditTemplate extends Component {

  constructor(props) {
    super(props);

    this.editorRef = React.createRef();
    this.editor = null;

  }

  componentDidMount() {

    let schema = this.props.messageTypes.messages.find((mes) => mes.id === this.props.curOpenMessageId);

    if (schema !== undefined) {
      this.editor = new JSONEditor(this.editorRef.current, {
        schema: schema.doc.details,
      });
    } else {

    }
  }

  render() {
    return (
      <div className="table">
        <Link to="/">Home</Link>
        <div className="container">
          <h3>Schema Editor</h3>
          <div id="schema-editor" ref={this.editorRef}></div>
        </div>
      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ messageTypes , curOpenMessageId}) => ({
  messageTypes,
  curOpenMessageId
});

export default connect(mapStateToProps)(EditTemplate);