import React, { Component } from 'react';
import { connect } from "react-redux";
import '../scss/App.scss';
import {
  showHideObjectives,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import ChannelTabsContainer from "./ChannelTabsContainer";
import GameAdmin from "./GameAdmin";
import TurnProgression from "../Components/TurnProgression";
import FeedbackChannel from "./FeedbackChannel";
import classNames from "classnames";

class GameChannels extends Component {

  showHideForceObjectives = () => {
    this.props.dispatch(showHideObjectives());
  };

  render() {

    return (
      <div className="flex-content flex-content--row-wrap">
        <div className="message-feed">
          <ChannelTabsContainer />
        </div>
        <div className={classNames({"message-feed": true, "out-of-game-feed": true, "umpire-feed": this.props.playerUi.controlUi})}>
          <TurnProgression />
          <GameAdmin />
        </div>
        {this.props.playerUi.controlUi &&
          <div className="message-feed feedback-channel">
            <FeedbackChannel />
          </div>
        }
        { this.props.playerUi.showObjective &&
          <div className="force-objectives">
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
