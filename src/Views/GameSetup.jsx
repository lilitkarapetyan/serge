import React, { Component } from 'react';
import {connect} from "react-redux";

import {setCurrentTab} from "../ActionsAndReducers/GameSetup/gameSetup_ActionCreators";

import TabbedView from "./TabbedView";
import ProgressBar from "../Components/ProgressBar/ProgressBar";

import Link from "../Components/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames";

class GameSetup extends Component {

  constructor(props) {
    super(props);
  }

  setCurrentTab = (tab) => {
    this.props.dispatch(setCurrentTab(tab));
  };

  createIndicators() {
    const that = this;

    return Object.entries(this.props.gameSetup.tabs).map(function (entry) {

      let active = that.props.gameSetup.currentTab === parseInt(entry[0]);
      let completed = entry[1].complete;
      return (<div key={entry[0]} className={classNames("progress-indicator", {"progress-indicator--active": active, "progress-indicator--complete": completed})}></div>);
    });
  }

  render() {
    return (
      <div className="view-wrapper">
        <div id="sidebar">
          <Link href="/" id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>
        </div>
        <div className="flex-content-wrapper flex-content-wrapper--distribute">
          <h1>Game setup page</h1>
          <ProgressBar>
            {this.createIndicators()}
          </ProgressBar>
        </div>
        <TabbedView
          tabs={this.props.gameSetup.tabs}
          setCurrentTab={this.setCurrentTab}
        />
      </div>
    );
  }
}



// temp use allMessages
const mapStateToProps = ({ gameSetup }) => ({
  gameSetup
});

export default connect(mapStateToProps)(GameSetup);