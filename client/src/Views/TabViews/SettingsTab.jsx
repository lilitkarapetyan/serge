import React, { Component } from 'react';
import {connect} from "react-redux";
import TextInput from "../../Components/Inputs/TextInput";
import DropdownInput from "../../Components/Inputs/DropdownInput";
import TextInputMasked from "../../Components/Inputs/TextInputMasked";
import millisecondsToDDHHMMSS from "../../Helpers/millisecondsToDDHHMMSS";
import millisecondsToHHMMSS from "../../Helpers/millisecondsToHHMMSS";
import Row from "../../Components/Layout/Row";
import {
  setGameData,
  saveSettings,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import TextArea from "../../Components/Inputs/TextArea";

import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from "react-flatpickr";
import moment from "moment";

class SettingsTab extends Component {

  constructor(props) {
    super(props);
  }

  updateDescription = (value) => {
    this.props.dispatch(setGameData({gameDescription: value, dirty: true}));
  };

  updateSpatialRepresentation = (value) => {
    this.props.dispatch(setGameData({spatialRepresentation: value, dirty: true}));
  };

  updateGameTurnTime = (value) => {

    if (value.length === 0) {
      this.props.dispatch(setGameData({gameTurnTime: null, dirty: true}));
      return;
    }
    if (value.indexOf("_") > -1) return;

    let days = parseInt(value.slice(0, 2));
    let hrs = parseInt(value.slice(3, 5));
    let mins = parseInt(value.slice(6, 8));
    let secs = parseInt(value.slice(9, 11));
    let milliseconds = (secs * 1000) + (mins * 60 * 1000) + (hrs * 60 * 60 * 1000) + (days * 24 * 60 * 60 * 1000);

    this.props.dispatch(setGameData({gameTurnTime: milliseconds, dirty: true}));
  };

  updateRealtimeTurnTime = (value) => {

    if (value.length === 0) {
      this.props.dispatch(setGameData({realtimeTurnTime: null, dirty: true}));
      return;
    }
    if (value.indexOf("_") > -1) return;

    let days = parseInt(value.slice(0, 2));
    let hrs = parseInt(value.slice(3, 5));
    let mins = parseInt(value.slice(6, 8));
    let secs = parseInt(value.slice(9, 11));
    let milliseconds = (secs * 1000) + (mins * 60 * 1000) + (hrs * 60 * 60 * 1000) + (days * 24 * 60 * 60 * 1000);

    this.props.dispatch(setGameData({realtimeTurnTime: milliseconds, dirty: true}));
  };

  updateTimeWarning = (value) => {

    if (value.length === 0) {
      this.props.dispatch(setGameData({timeWarning: null, dirty: true}));
      return;
    }
    if (value.indexOf("_") > -1) return;

    let hrs = parseInt(value.slice(0, 2));
    let mins = parseInt(value.slice(3, 5));
    let secs = parseInt(value.slice(6, 8));

    let milliseconds = (secs * 1000) + (mins * 60 * 1000) + (hrs * 60 * 60 * 1000);

    this.props.dispatch(setGameData({timeWarning: milliseconds, dirty: true}));
  };

  updateTurnStrategy = (value) => {
    this.props.dispatch(setGameData({turnStrategy: value, dirty: true}));
  };

  saveSettings = () => {
    let curTab = this.props.wargame.currentTab;
    let tabData = this.props.wargame.data[curTab];
    tabData.dirty = false;
    this.props.dispatch(saveSettings(this.props.wargame.currentWargame, tabData));
  };

  updateStartDate = (value) => {
    let date = moment(value[0], moment.ISO_8601).format();
    this.props.dispatch(setGameData({startTime: date, dirty: true}));
  };

  render() {

    let spatialRepresentationOptions = [{value: "opt1", option: "opt1"}, {value: "opt2", option: "opt2"}, {value: "opt3", option: "opt3"}]
    let turnStrategyOptions = [{value: "opt1", option: "opt1"}, {value: "opt2", option: "opt2"}, {value: "opt3", option: "opt3"}]

    return (
      <div className="flex-content-wrapper settingsTab">
        <div className="flex-content flex-content--left50">
          <p className="heading--sml">Game description &amp; objectives</p>
          <TextArea
            className="description"
            updateStore={this.updateDescription}
            data={this.props.wargame.data[this.props.wargame.currentTab].gameDescription}
          />
        </div>

        <div className="flex-content flex-content--right50">
          <Row className="flex-content--rowend">
            <span className="link link--noIcon" onClick={this.saveSettings}>save Overview</span>
          </Row>
          {/*<Row>*/}
            {/*<div className="flex-content settings-title">*/}
              {/*<p className="heading--sml">Spatial Representation</p>*/}
            {/*</div>*/}
            {/*<div className="flex-content flex-content--fill">*/}
              {/*<DropdownInput*/}
                {/*updateStore={this.updateSpatialRepresentation}*/}
                {/*selectOptions={spatialRepresentationOptions}*/}
                {/*placeholder="Select spatial representation"*/}
                {/*data={this.props.wargame.data[this.props.wargame.currentTab].spatialRepresentation}*/}
              {/*/>*/}
            {/*</div>*/}
          {/*</Row>*/}

          <Row>
            <div className="flex-content flex-content--sml">
              <TextInputMasked
                mask="11 11 11 11"
                placeholder="DD HH MM SS"
                className="material-input"
                label="Wargame turn time (DD HH MM SS)"
                updateStore={this.updateGameTurnTime}
                data={millisecondsToDDHHMMSS(this.props.wargame.data[this.props.wargame.currentTab].gameTurnTime)}
              />
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <TextInputMasked
                mask="11 11 11 11"
                placeholder="DD HH MM SS"
                className="material-input"
                label="Real time planning allowance (DD HH MM SS)"
                updateStore={this.updateRealtimeTurnTime}
                data={millisecondsToDDHHMMSS(this.props.wargame.data[this.props.wargame.currentTab].realtimeTurnTime)}
              />
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              {/*<TextInput*/}
                {/*className="material-input"*/}
                {/*label="Display time warning at.. (mins)"*/}
                {/*updateStore={this.updateTimeWarning}*/}
                {/*options={{ numInput: true }}*/}
                {/*data={this.props.wargame.data[this.props.wargame.currentTab].timeWarning}*/}
              {/*/>*/}
              <TextInputMasked
                mask="11 11 11"
                placeholder="HH MM SS"
                className="material-input"
                label="Display time warning at (HH MM SS)"
                updateStore={this.updateTimeWarning}
                data={millisecondsToHHMMSS(this.props.wargame.data[this.props.wargame.currentTab].timeWarning)}
              />
            </div>
          </Row>

          {/*<Row>*/}
            {/*<div className="flex-content settings-title">*/}
              {/*<p className="heading--sml">Turn Strategy</p>*/}
            {/*</div>*/}
            {/*<div className="flex-content flex-content--fill">*/}
              {/*<DropdownInput*/}
                {/*updateStore={this.updateTurnStrategy}*/}
                {/*selectOptions={turnStrategyOptions}*/}
                {/*placeholder="Not implemented yet"*/}
                {/*data={this.props.wargame.data[this.props.wargame.currentTab].turnStrategy}*/}
                {/*// disabled={true}*/}
              {/*/>*/}
            {/*</div>*/}
          {/*</Row>*/}

          <Row>
            <div className="settings-title">
              <p>Start time</p>
            </div>
            <div className="flex-content flex-content--fill">
              <Flatpickr
                value={this.props.wargame.data[this.props.wargame.currentTab].startTime}
                onChange={this.updateStartDate}
                options={{
                  enableTime: true,
                }}
                />
            </div>
          </Row>

        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ wargame }) => ({
  wargame,
});

export default connect(mapStateToProps)(SettingsTab);
