import React, { Component } from 'react';
import {connect} from "react-redux";

import Link from "../Components/Link";

import '../scss/App.scss';
import {
  ADMIN_ROUTE,
  GAME_SETUP_ROUTE,
  MESSAGE_LIBRARY_ROUTE,
  MESSAGE_TEMPLATE_ROUTE,
  WELCOME_SCREEN_EDIT_ROUTE,
} from "../consts";

import {
  createNewWargameDB,
  clearWargames,
  populateWargameStore,
} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import WargameSearchList from "../Components/WargameSearchList";
import {
  populateMessageTypesDb
} from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";

class GameDesignerInterface extends Component {

  componentWillMount() {
    this.props.dispatch(populateMessageTypesDb());
    this.props.dispatch(populateWargameStore());
  }

  createWargame = () => {
    this.props.dispatch(createNewWargameDB());
  };

  clearWargames = () => {
    this.props.dispatch(clearWargames());
  };

  render() {

    let loading = Object.values(this.props.dbLoading).some((loading) => loading );

    if (loading) {
      return (
        <div id="loading">
          <div>
            <div id="loader"></div>
          </div>
        </div>
      )
    }

    return (
      <div id="umpire" className="flex-content-wrapper">
        <div id="sidebar_admin">
          <Link href={ADMIN_ROUTE} class="link link--large link--active">Games</Link>
          <Link href={MESSAGE_TEMPLATE_ROUTE} class="link link--large">Message Templates</Link>
          <Link href={MESSAGE_LIBRARY_ROUTE} class="link link--large">Message Library</Link>
          <Link href={WELCOME_SCREEN_EDIT_ROUTE} class="link link--large">Welcome Screen</Link>
        </div>
        <div className="flex-content flex-content--big flex-content--last">
          <h2>Games</h2>
          <Link
            href={GAME_SETUP_ROUTE}
            class="link link--noIcon"
            onClickHandler={this.createWargame}
          >Create</Link>
          <Link
            href={ADMIN_ROUTE}
            class="link link--noIcon link--secondary"
            onClickHandler={this.clearWargames}
          >Clear wargames</Link>
          <WargameSearchList key="searchlist"
                             listData={this.props.wargame.wargameList}
          />
        </div>
      </div>
    );
  }
}

// empty mapStateToProps is here for react-redux to wire up the dispatch function to props so firing actions is possible.
const mapStateToProps = ({wargame, dbLoading}) => ({
  wargame,
  dbLoading
});


export default connect(mapStateToProps)(GameDesignerInterface);
