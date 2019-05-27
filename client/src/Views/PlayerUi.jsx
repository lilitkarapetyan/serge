import React, { Component } from 'react';
import { connect } from "react-redux";
import Resizable from "re-resizable";
import '../scss/App.scss';
import {
  getWargame,
  setForce,
  setRole,
  setFilteredChannels,
  initiateGame,
  // getAllMessages,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessageFeeds from "./MessageFeeds";
import OutOfGameFeed from "./OutOfGameFeed";
import DropdownInput from "../Components/Inputs/DropdownInput";
import TurnProgression from "../Components/TurnProgression";
import AwaitingStart from "../Components/AwaitingStart";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

class PlayerUi extends Component {

  // componentWillMount() {
  //   this.props.dispatch(getAllMessages());
  // }

  updateSelectedWargame = (wargamePath) => {
    this.props.dispatch(getWargame(wargamePath));
  };

  updateSelectedForce = (force) => {
    this.props.dispatch(setForce(force));
  };

  updateSelectedRole = (selectedRole) => {

    let role = this.props.playerUi.allForces.find((f) => f.uniqid === this.props.playerUi.selectedForce).roles.find((role) => role.name === selectedRole);

    this.props.dispatch(setRole(role));
    this.props.dispatch(setFilteredChannels(true));
  };

  goBack = () => {
    this.props.dispatch(setForce(""));
  };

  initiateGameplay = () => {
    this.props.dispatch(initiateGame(this.props.playerUi.currentWargame));
  };

  render() {

    // PAGE DRAG EVENT LISTENER BUBBLE TO EACH ROW, RESIZE ROW WIDTH ON DRAG

    return (
      <div className="flex-content-wrapper">

        <div className="flex-content flex-content--fill">

          {!this.props.playerUi.currentWargame &&
            <div className="flex-content--center">
              <h1>Set wargame</h1>
              <DropdownInput
                updateStore={this.updateSelectedWargame}
                selectOptions={this.props.wargame.wargameList.map((wargame) => ({option: wargame.title, value: wargame.name}))}
              />
            </div>
          }

          {this.props.playerUi.currentWargame && !this.props.playerUi.selectedForce ?
            <div className="flex-content--center">
              <h1>Set force</h1>
              <DropdownInput
                updateStore={this.updateSelectedForce}
                selectOptions={this.props.playerUi.allForces.map((force) => ({option: force.name, value: force.uniqid}))}
              />
            </div>
            : false
          }

          {this.props.playerUi.selectedForce && !this.props.playerUi.selectedRole ?
            <div className="flex-content--center">
              <h1>Set role</h1>
              <FontAwesomeIcon icon={faArrowLeft} size="2x" style={{cursor: 'pointer'}} onClick={this.goBack} />
              <DropdownInput
                updateStore={this.updateSelectedRole}
                selectOptions={this.props.playerUi.allForces.find((f) => f.uniqid === this.props.playerUi.selectedForce).roles.map((role) => ({option: role.name, value: role.name}))}
              />
            </div>
            : false
          }

          {this.props.playerUi.selectedForce && this.props.playerUi.selectedRole && this.props.playerUi.wargameInitiated ?
            <div className="flex-content flex-content--row-wrap">
              <div className="message-feed">
                <MessageFeeds />
              </div>
              <div className="message-feed out-of-game-feed">
                <TurnProgression />
                <OutOfGameFeed />
              </div>
            </div>
            : false
          }

          {this.props.playerUi.selectedForce && this.props.playerUi.selectedRole && !this.props.playerUi.wargameInitiated ?

            <div className="pre-start-screen">
              {this.props.playerUi.controlUi ?
                <button name="delete" className="btn btn-action btn-action--primary" onClick={this.initiateGameplay}>Start Game</button>
              : <AwaitingStart description={this.props.playerUi.gameDescription} />}
            </div>
          : false }

        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ playerUi, wargame }) => ({
  playerUi,
  wargame,
});

export default connect(mapStateToProps)(PlayerUi);
