import React, { Component } from 'react';
import { connect } from 'react-redux';

import Link from "../Components/Link";

import '../scss/App.scss';
import {populateWargameStore} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class UmpireMenu extends Component {

  componentWillMount() {
    this.props.dispatch(populateWargameStore());
  }

  render() {
    return (
      <div id="umpire" className="flex-content-wrapper">
        <div className="flex-content flex-content--fill">
          <Link href="/client/umpireMenu" class="link link--secondary link--large">Umpire Menu</Link>
          <Link href="/client/playerUi" class="link link--secondary link--large">Player UI</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(UmpireMenu);
