import React, { Component } from 'react';
// import ReactDOM from "react-dom";
import '../scss/App.scss';
import { connect } from "react-redux";

// import JSONEditor from '@json-editor/json-editor';

// import warGameSchema from "../schemas/wargame.json";
import JsonEditor from "./MessageUIContainer";
// import {Link} from "react-router-dom";
// import SearchList from "../Components/SearchList";
import {setOpenMessage} from "../ActionsAndReducers/setOpenMessage/setOpenMessage_ActionCreators";

class CreateTemplate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      creatorType: this.props.match.url.split('/')[2]
    };

    console.log(this.props.match.url.split('/')[2]);
  }

  setOpenMessageId(id) {
    this.props.dispatch(setOpenMessage(id));
  }

  render() {
    var that = this;
    return (
      <div className="view-wrapper">
        <h1>Message {this.state.creatorType}</h1>
        <div className="flex-content-wrapper">
          <div id="selection" className="flex-content">
            <input type="text" className="search" key="search-templates" placeholder={`Search ${this.state.creatorType}`} onChange={ this.filterMessages } />
            {this.props.messageTypes.messages.map(function(item) {
              return <span href="#" onClick={that.setOpenMessageId.bind(that, item.doc._id)} key={item.doc._id}>{item.doc.title}</span>
            })}
          </div>
          <div id="preview" className="flex-content flex-content--big">
              <p>Preview</p>
            <JsonEditor id="preview" messageTypes={ this.props.messageTypes.messages } curOpenMessageId={ this.props.curOpenMessageId } />
          </div>
          <div id="function" className="flex-content flex-content--sml">

          </div>
        </div>
      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ messageTypes, curOpenMessageId }) => ({
  messageTypes,
  curOpenMessageId
});

export default connect(mapStateToProps)(CreateTemplate);