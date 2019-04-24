import React, { Component } from 'react';
import {connect} from "react-redux";

import {
  setCurrentTab,
  setWargameTitle,
  updateWargame,
  renameWargame,
  validateWargameData,
} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import TabbedView from "./TabbedView";
import ProgressBar from "../Components/ProgressBar/ProgressBar";

import Link from "../Components/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames";
import TextInput from "../Components/Inputs/TextInput";
import {modalAction} from "../ActionsAndReducers/Modal/Modal_ActionCreators";
import ValidationNotification from "../Components/ValidationNotification";
import {getAllMessageTypes} from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";

class GameSetup extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getAllMessageTypes());
  }

  setCurrentTab = (tab) => {
    this.props.dispatch(setCurrentTab(tab));
  };

  createIndicators() {
    const that = this;

    return Object.entries(this.props.wargame.tabs).map(function (entry) {

      let active = that.props.wargame.currentTab === parseInt(entry[0]);
      let completed = entry[1].complete;
      return (<div key={entry[0]} className={classNames("progress-indicator", {"progress-indicator--active": active, "progress-indicator--complete": completed})}></div>);
    });
  }

  updateWargameTitle = (name) => {
    this.props.dispatch(setWargameTitle(name));
  };


  saveWargame = () => {
    if (this.checkAllValid()) {
      this.props.dispatch(updateWargame(this.props.wargame.currentWargame, this.props.wargame.tabs, this.props.wargame.wargameTitle));
    }
  };

  checkAllValid = () => {
    return Object.values(this.props.wargame.validation).reduce((entry) => entry === true);
  };

  render() {
    return (
      <>
        <div className="view-wrapper">
          <div id="sidebar">
            <Link href="/" id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>
          </div>
          <div className="flex-content-wrapper flex-content-wrapper--distribute">
            <TextInput
              id="title-editable"
              updateStore={this.updateWargameTitle}
              options={{numInput: false}}
              data={this.props.wargame.wargameTitle}
              validInput={this.props.wargame.validation.validWargameName}
            />
            <span className={classNames({"link": true, "link--noIcon": true, "link--disabled": !this.checkAllValid()})} onClick={this.saveWargame}>save</span>
            <ProgressBar>
              {this.createIndicators()}
            </ProgressBar>
          </div>
          <TabbedView
            tabs={this.props.wargame.tabs}
            setCurrentTab={this.setCurrentTab}
          />
        </div>
      </>
    );
  }
}



// temp use allMessages
const mapStateToProps = ({ wargame }) => ({
  wargame
});

export default connect(mapStateToProps)(GameSetup);
