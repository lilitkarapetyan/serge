import React, { Component } from 'react'
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap'
import { PreviewEditor } from '../../js-modules/json-schema-editor/editor'

class EditorPreview extends Component {

  constructor(props, content) {
    super(props, content)

    this.previewBox = React.createRef()
    this.editorPreview = null
  }

  componentDidMount() {
    this.editorPreview = new PreviewEditor('editor-preview')
  }

  componentWillReceiveProps({ schema }) {
    this.editorPreview.destroy()
    this.editorPreview.updateSchema(schema)

  }

  render () {
    return (
      <Card>
        <CardHeader>
          Editor Preview
        </CardHeader>
        <CardBody>
          <div id='editor-preview' ref={this.previewBox}/>
        </CardBody>
        <CardFooter>
          The Editor Preview will be updated as you make changes in the Schema Editor
        </CardFooter>
      </Card>
    )
  }
}


export default EditorPreview
