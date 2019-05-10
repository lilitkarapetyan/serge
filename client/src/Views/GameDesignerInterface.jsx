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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

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
        <div id="sidebar">
          <Link href="/client" id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>
        </div>
        <div className="flex-content flex-content--big flex-content--first">
          <Link href="/client/umpireMenu/templates" class="link link--secondary link--large">Message Templates</Link>
          <Link href="/client/umpireMenu/library" class="link link--secondary link--large">Message Library</Link>
        </div>
        <div className="flex-content flex-content--big flex-content--last">
          <h2>Games</h2>
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
