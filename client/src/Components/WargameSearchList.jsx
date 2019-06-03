import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import _ from "lodash";

import {
  editWargame,
  duplicateWargame,
} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import {setCurrentViewFromURI} from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_ActionCreators";

import {
  faClone,
  faPencilAlt,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {modalAction} from "../ActionsAndReducers/Modal/Modal_ActionCreators";

class WargameSearchList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageList: this.props.listData,
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
    this.props.dispatch(editWargame(name));
    this.props.dispatch(setCurrentViewFromURI('/client/gameSetup'));
  }

  duplicateWargame(name) {
    this.props.dispatch(duplicateWargame(name));
  }

  deleteWargame(name) {
    this.props.dispatch(modalAction.open("deleteWargame", name));
  }

  filterMessages = (input) => {

    let value = input ? input.target.value : this.state.searchInput;

    let searchQuery = this.props.listData.filter(function(db) {
      return db.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });

    this.setState({
      searchQuery,
      searchInput: input ? value : this.state.searchInput
    });
  };

  displayControls = (activeTitle) => {
    this.setState({
      activeTitle,
    });
  };

  hideControls = () => {
    this.setState({
      activeTitle: false,
    });
  };

  render() {

    var that = this;

    var list = this.state.searchInput ? this.state.searchQuery : this.state.messageList;

    return (
      <div className="searchlist">
        <input type="text" className="searchlist-input" key="search-templates" placeholder="Search games" onChange={ this.filterMessages } value={this.state.searchInput} />
        <div className="searchlist-list">
          { list.map(function(db) {
            // let active
            return (
              <span className="searchlist-title" key={db.title} onMouseOver={that.displayControls.bind(that, db.title)} onMouseLeave={that.hideControls}>
                {db.title}
                {that.state.activeTitle === db.title &&
                  <>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={that.setSelectedWargame.bind(that, db.name)} />
                    <FontAwesomeIcon icon={faClone} onClick={that.duplicateWargame.bind(that, db.name)} />
                    <FontAwesomeIcon icon={faTrash} onClick={that.deleteWargame.bind(that, db.name)} />
                  </>
                }
              </span>
            )
          })}
        </div>
      </div>
    );
  }
}

// empty mapStateToProps is here for react-redux to wire up the dispatch function to props so firing actions is possible.
const mapStateToProps = () => ({});


export default connect(mapStateToProps)(WargameSearchList);
