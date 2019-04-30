import React, { Component } from 'react';
import { connect } from 'react-redux';

import Link from "../Components/Link";
import classNames from "classnames";

import '../scss/App.scss';
import {populateWargameStore} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class UmpireMenu extends Component {

  componentWillMount() {
    this.props.dispatch(populateWargameStore());
  }

  render() {

    let activeGames = this.props.wargame.wargameList.length > 0;

    return (
      <div id="umpire" className="flex-content-wrapper">
        <div className="flex-content flex-content--fill">
          <Link href="/client/umpireMenu" class="link link--secondary link--large">Umpire Menu</Link>
          <Link href="/client/playerUi" disabled={!activeGames} class={classNames("link", "link--secondary", "link--large", {"link--disabled": !activeGames})}>Player UI</Link>
          { !activeGames ? <p>At least one wargame needed to access player ui</p> : false }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({wargame}) => ({
  wargame,
});

export default connect(mapStateToProps)(UmpireMenu);
