import React, { Component } from 'react';

import JSONEditor from '@json-editor/json-editor';

import '../scss/App.scss';

class JsonEditor extends Component {

  constructor(props) {
    super(props);

    this.editor = null;
    this.editorPreviewRef = React.createRef();

    this.state = {
      messageTypes: [],
    };

  }

  componentWillUpdate(nextProps, nextState, nextContext) {

    if (this.editor) {
      this.editor.destroy();
    }

    if (nextProps.curOpenMessageId.length > 0) {
      this.editor = new JSONEditor(this.editorPreviewRef.current, {
        schema: this.props.messageTypes.messages.find((mes) => mes.id === nextProps.curOpenMessageId).doc.details
      });
      this.editor.disable();
    } else {
      if (this.editor) {
        this.editor.destroy();
      }
    }
  }



  render() {
    return (
      <div id="editor-preview" ref={this.editorPreviewRef}></div>
    );
  }
}

export default JsonEditor;