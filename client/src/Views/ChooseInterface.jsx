import React, { Component } from 'react';
import { connect } from 'react-redux';

import Link from "../Components/Link";
import classNames from "classnames";

import '../scss/App.scss';
import {populateWargameStore} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import {
  getAllMessageTypes,
  populateMessageTypesDb
} from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import {ADMIN_ROUTE, PLAYERUI_ROUTE} from "../consts";

class UmpireMenu extends Component {

  componentWillMount() {
    this.props.dispatch(populateMessageTypesDb());
    this.props.dispatch(populateWargameStore());
    this.props.dispatch(getAllMessageTypes());
  }

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

    let activeGames = this.props.wargame.wargameList.length > 0;

    return (
      <div id="umpire" className="flex-content-wrapper">
        <div className="flex-content flex-content--fill">
          <Link href={ADMIN_ROUTE} class="link link--secondary link--large">Admin</Link>
          <Link href={PLAYERUI_ROUTE} disabled={!activeGames} class={classNames("link", "link--secondary", "link--large", {"link--disabled": !activeGames})}>Player UI</Link>
          { !activeGames ? <p>At least one wargame needed to access player ui</p> : false }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({wargame, dbLoading}) => ({
  wargame,
  dbLoading,
});

export default connect(mapStateToProps)(UmpireMenu);
