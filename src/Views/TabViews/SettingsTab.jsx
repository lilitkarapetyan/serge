import React, { Component } from 'react';
import {connect} from "react-redux";
import TextInput from "../../Components/Inputs/TextInput";
import DropdownInput from "../../Components/Inputs/DropdownInput";
import Row from "../../Components/Layout/Row";

import { setGameData } from "../../ActionsAndReducers/GameSetup/gameSetup_ActionCreators";
import TextArea from "../../Components/Inputs/TextArea";

class SettingsTab extends Component {

  constructor(props) {
    super(props);
  };

  updateDescription = (value) => {
    this.props.dispatch(setGameData({gameDescription: value}));
  };

  updateSpatialRepresentation = (value) => {
    this.props.dispatch(setGameData({spatialRepresentation: value}));
  };

  updatePlanningInterval = (value) => {
    this.props.dispatch(setGameData({planningInterval: value}));
  };

  updateReplayInterval = (value) => {
    this.props.dispatch(setGameData({replayInterval: value}));
  };

  updateTurnStrategy = (value) => {
    this.props.dispatch(setGameData({turnStrategy: value}));
  };

  render() {
    return (
      <div className="flex-content-wrapper">

        <div className="flex-content flex-content--left50">
          <p className="heading--sml">Game description &amp; objectives</p>
          <TextArea
            updateStore={this.updateDescription}
            data={this.props.gameSetup.tabs[this.props.tab].data.gameDescription}
          />
        </div>

        <div className="flex-content flex-content--right50">

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Spatial Representation</p>
            </div>
            <div className="flex-content flex-content--fill">
              <DropdownInput
                updateStore={this.updateSpatialRepresentation}
                selectOptions={["opt1", "opt2", "opt3"]}
                placeholder="Select spatial representation"
                data={this.props.gameSetup.tabs[this.props.tab].data.spatialRepresentation}
              />
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Planning Interval</p>
            </div>
            <div className="flex-content flex-content--sml">
              <TextInput
                updateStore={this.updatePlanningInterval}
                options={{ numInput: true }}
                data={this.props.gameSetup.tabs[this.props.tab].data.planningInterval}
              />
            </div>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml heading--mleft">min.</p>
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Replay interval</p>
            </div>
            <div className="flex-content flex-content--sml">
              <TextInput
                updateStore={this.updateReplayInterval}
                options={{ numInput: true }}
                data={this.props.gameSetup.tabs[this.props.tab].data.replayInterval}
              />
            </div>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml heading--mleft">min.</p>
            </div>
          </Row>

          <Row>
            <div className="flex-content flex-content--sml">
              <p className="heading--sml">Turn Strategy</p>
            </div>
            <div className="flex-content flex-content--fill">
              <DropdownInput
                updateStore={this.updateTurnStrategy}
                selectOptions={["opt1", "opt2", "opt3"]}
                placeholder="Not implemented yet"
                data={this.props.gameSetup.tabs[this.props.tab].data.turnStrategy}
                // disabled={true}
              />
            </div>
          </Row>

        </div>
      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ gameSetup }) => ({
  gameSetup,
});

export default connect(mapStateToProps)(SettingsTab);
