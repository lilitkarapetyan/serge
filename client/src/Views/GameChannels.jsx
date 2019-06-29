import React, { Component } from 'react';
import { connect } from "react-redux";
import '../scss/App.scss';
import {
  showHideObjectives,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import ChannelTabsContainer from "./ChannelTabsContainer";
import TurnProgression from "../Components/TurnProgression";
import AdminAndInsightsTabsContainer from "./AdminAndInsightsTabsContainer";
import classNames from "classnames";

class GameChannels extends Component {

  showHideForceObjectives = () => {
    this.props.dispatch(showHideObjectives());
  };

  render() {

    let force = this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce);

    if (!force) {
      return (
        <div className="flex-content--center">
          <h1>Chosen force not in game</h1>
          <h4>Please reload and select a force</h4>
        </div>
      )
    }

    return (
      <div className="flex-content flex-content--row-wrap">
        <div className="message-feed" data-tour="fourth-step">
          <ChannelTabsContainer />
        </div>
        <div className={classNames({"message-feed": true, "out-of-game-feed": true, "umpire-feed": this.props.playerUi.controlUi})} data-tour="fifth-step">
          <TurnProgression />
          <AdminAndInsightsTabsContainer />
        </div>
        { this.props.playerUi.showObjective &&
          <div className="force-objectives" style={{borderColor: this.props.playerUi.forceColor}}>
            <h3>Objectives</h3>
            <div className="objective-text">
              {this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce).overview}
            </div>

            <div className="role-info">
              <span className="force-type">{ this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce).name }</span>
              <img src={this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce).icon} alt="" onClick={this.showHideForceObjectives} />
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(GameChannels);
