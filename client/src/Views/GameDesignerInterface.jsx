import React, { Component } from 'react';
import {connect} from "react-redux";

import Link from "../Components/Link";

import '../scss/App.scss';
// import SearchList from "../Components/SearchList";

import {
  createNewWargameDB,
  clearWargames,
} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import WargameSearchList from "../Components/WargameSearchList";

class GameDesignerInterface extends Component {

  createWargame = () => {
    this.props.dispatch(createNewWargameDB());
  };

  clearWargames = () => {
    this.props.dispatch(clearWargames());
  };

  render() {
    return (
      <div id="umpire" className="flex-content-wrapper">
        <div className="flex-content flex-content--big">
          <Link href="/client/umpireMenu/templates" class="link link--secondary link--large">Message Templates</Link>
          <Link href="/client/umpireMenu/library" class="link link--secondary link--large">Message Library</Link>
        </div>
        <div className="flex-content flex-content--big">
          <span>Games</span>
          <Link
            href="/client/gameSetup"
            class="link link--noIcon"
            onClickHandler={this.createWargame}
          >Create</Link>
          <Link
            href="/client/umpireMenu"
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
const mapStateToProps = ({wargame}) => ({
  wargame
});


export default connect(mapStateToProps)(GameDesignerInterface);
