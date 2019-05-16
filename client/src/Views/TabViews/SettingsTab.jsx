import React, { Component } from 'react';
import {connect} from "react-redux";
import TextInput from "../../Components/Inputs/TextInput";
import DropdownInput from "../../Components/Inputs/DropdownInput";
import Row from "../../Components/Layout/Row";

import {
  setGameData,
  saveSettings,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import TextArea from "../../Components/Inputs/TextArea";

import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from "react-flatpickr";

class SettingsTab extends Component {

  updateDescription = (value) => {
    this.props.dispatch(setGameData({gameDescription: value, dirty: true}));
  };

  updateSpatialRepresentation = (value) => {
    this.props.dispatch(setGameData({spatialRepresentation: value, dirty: true}));
  };

  updatePlanningInterval = (value) => {
    this.props.dispatch(setGameData({planningInterval: value, dirty: true}));
  };

  updateReplayInterval = (value) => {
    this.props.dispatch(setGameData({replayInterval: value, dirty: true}));
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
    this.props.dispatch(setGameData({startTime: value[0].toISOString(), dirty: true}));
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
          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Spatial Representation</p>
            </div>
            <div className="flex-content flex-content--fill">
              <DropdownInput
                updateStore={this.updateSpatialRepresentation}
                selectOptions={spatialRepresentationOptions}
                placeholder="Select spatial representation"
                data={this.props.wargame.data[this.props.wargame.currentTab].spatialRepresentation}
              />
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">War Game turn time</p>
            </div>
            <div className="flex-content flex-content--sml">
              <TextInput
                updateStore={this.updatePlanningInterval}
                options={{ numInput: true }}
                data={this.props.wargame.data[this.props.wargame.currentTab].planningInterval}
              />
            </div>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml heading--mleft">hrs.</p>
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Real time planning allowance.</p>
            </div>
            <div className="flex-content flex-content--sml">
              <TextInput
                updateStore={this.updateReplayInterval}
                options={{ numInput: true }}
                data={this.props.wargame.data[this.props.wargame.currentTab].replayInterval}
              />
            </div>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml heading--mleft">mins.</p>
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Turn Strategy</p>
            </div>
            <div className="flex-content flex-content--fill">
              <DropdownInput
                updateStore={this.updateTurnStrategy}
                selectOptions={turnStrategyOptions}
                placeholder="Not implemented yet"
                data={this.props.wargame.data[this.props.wargame.currentTab].turnStrategy}
                // disabled={true}
              />
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Start time</p>
            </div>
            <div className="flex-content flex-content--fill">
              <Flatpickr
                value={this.props.wargame.data[this.props.wargame.currentTab].startTime}
                onChange={this.updateStartDate}
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
