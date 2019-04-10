import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import {setSelectedSchema} from "../ActionsAndReducers/UmpireMenu/umpireMenu_ActionCreators";
import {getSingleMessage} from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import moment from "moment";
import _ from "lodash";
import {getAllDataFromWargame} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class WargameSearchList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageList: this.props.listData, // for HOC
      searchQuery: this.props.listData,
      searchInput: "",
    };
  }


  componentWillUpdate(nextProps, nextState, nextContext) {

    let sameMessagesQuantity = _.difference(nextProps.listData, this.state.messageList).length;

    if (
      nextProps.listData.length !== this.state.messageList.length ||
      (sameMessagesQuantity !== 0 && this.state.searchInput.length === 0)
    ) {
      this.setState({
        messageList: nextProps.listData
      });
    }

    if (
      this.state.searchInput.length > 0 &&
      sameMessagesQuantity !== 0
    ) {
      this.filterMessages();
    }
  }

  setSelectedWargame(name) {
    this.props.dispatch(getAllDataFromWargame(name));
  }

  filterMessages = (input) => {

    let value = input ? input.target.value : this.state.searchInput;

    let searchQuery = this.props.listData.filter(function(name) {
      return name.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });

    this.setState({
      searchQuery,
      searchInput: input ? value.toLowerCase() : this.state.searchInput
    });
  };

  render() {

    var that = this;

    var list = this.state.searchInput ? this.state.searchQuery : this.state.messageList;

    return (
      <div className="searchlist">
        <input type="text" className="searchlist--input" key="search-templates" placeholder="Search games" onChange={ this.filterMessages } value={this.state.searchInput} />
        <div className="searchlist--list">
          { list.map(function(name) {

            // onClick handlers should not contain instantiating () to pass a specific value, .bind can be used here this is a simpler
            // ES5 way to pass properties to click handlers from arrays, another option is to build a sub-component but I don't like
            // how the data moves back and forth, it breaks Reacts initial idea of 1 way data flow.

            console.log(that.props.selectedWargame);

            // let active

            return <span href="#" onClick={that.setSelectedWargame.bind(that, name)} key={name} >{name}</span>
          })}
        </div>
      </div>
    );
  }
}

// empty mapStateToProps is here for react-redux to wire up the dispatch function to props so firing actions is possible.
const mapStateToProps = ({  }) => ({
});


export default connect(mapStateToProps)(WargameSearchList);
