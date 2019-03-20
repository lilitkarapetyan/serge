import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import {setOpenMessage} from "../ActionsAndReducers/setOpenMessage/setOpenMessage_ActionCreators";

class SearchList extends Component {

  constructor(props) {
    super(props);
    console.log(this.props);
  }

  setOpenMessageId(id) {
    this.props.dispatch(setOpenMessage(id));
  }

  createList() {
    var that = this;
    this.props.messageTypes.messages.map(function(item) {
      // onClick handlers should not contain instantiating () to pass a specific value, .bind can be used here this is a simpler
      // ES5 way to pass properties to click handlers from arrays, another option is to build a sub-component but I don't like
      // how the data moves back and forth, it breaks Reacts initial idea of 1 way data flow.
      return <a href="#" onClick={that.setOpenMessageId.bind(that, item.doc._id)} key={item.doc._id}>{item.doc.title}</a>
    });
  }

  render() {
    return (
      <>
        [<input type="text" className="search" key="search-templates" placeholder={`Search ${this.props.creatorType}`} onChange={ this.filterMessages } />
        { this.createList() }
      </>
    );
  }
}

const mapStateToProps = ({ messageTypes, curOpenMessageId }) => ({
  curOpenMessageId
});


export default connect(mapStateToProps)(SearchList);