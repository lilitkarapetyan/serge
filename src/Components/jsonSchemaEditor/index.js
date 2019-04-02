import React, { Component } from 'react'
import { css } from 'aphrodite/no-important'
import styles from './styles'
import jsonMetaSchema from './data.json'
import { Container, Col, Row } from 'reactstrap'
import JSONEditor from '@json-editor/json-editor'
import Editor from './jsonEditor'
import Preview from './editorPreview'
import SchemaView from './metaSchema'
import Options from './options'
import DevSection from '../devSection'

class MessageTypes extends Component {

  constructor(props, content) {
    super(props, content)

    JSONEditor.defaults.options.iconlib = "fontawesome5"
    JSONEditor.defaults.options.theme   = 'bootstrap4'
    this.updateMetaSchema = this.updateMetaSchema.bind(this)
    this.updatePreviewSchema = this.updatePreviewSchema.bind(this)
    this.updateOptions = this.updateOptions.bind(this)

    this.schemaEditor = null
    this.editorPreview = null

    this.defaultValue = {
      "type": "object",
      "properties": {
        "Date": {
          "type": "string",
          "format": "datetime-local"
        },
        "Status": {
          "type": "string",
          "enum": [
            "Minor",
            "Major",
            "Critical"
          ]
        },
        "Description": {
          "type": "string",
          "format": "textarea"
        }
      },
      "title": "Machinery Failure",
      "format": "grid"
    }

    this.state = {
      metaSchema: jsonMetaSchema,
      previewSchema: null,
      options: {
        layout: JSONEditor.defaults.options.object_layout,
        booleanOptions: {}
      }
    }
  }

  updatePreviewSchema(schema) {
    console.log("preview update");
    this.setState({previewSchema: schema})
  }

  updateOptions(options) {
    console.log("options update");
    this.setState({options: options})
  }

  updateMetaSchema(schema) {
    console.log("editor update");
    this.setState({metaschema: schema})
  }

  render() {
    return (
      <div className={css(styles.main)}>
        <Container fluid>
          <Row>
            <Col md={6}>
              <Editor
                schema={this.state.metaSchema}
                onChange={this.updatePreviewSchema}
                options={this.state.options}
                defaultValue={this.defaultValue}
              />
            </Col>
            <Col md={6}>
              <Preview schema={this.state.previewSchema}/>
            </Col>
          </Row>
          <DevSection>
            <div className={css(styles.devSection)}>
              <Row>
                <Col md={6}>
                  <Options options={this.state.options} onChange={this.updateOptions}/>
                </Col>
                <Col md={6}>
                  <SchemaView value={this.state.metaSchema} onSchemaSubmit={this.updateMetaSchema}/>
                </Col>
              </Row>
            </div>
          </DevSection>
        </Container>
      </div>
    )
  }
}

export default MessageTypes
