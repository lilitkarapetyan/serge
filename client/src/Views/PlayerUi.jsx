import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";
import '../scss/App.scss';
import {
  getWargame,
  setForce,
  setRole,
  initiateGame, getAllWargameMessages,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import {
  addNotification,
} from "../ActionsAndReducers/Notification/Notification_ActionCreators";

import ChannelTabsContainer from "./ChannelTabsContainer";
import OutOfGameFeed from "./OutOfGameFeed";
import DropdownInput from "../Components/Inputs/DropdownInput";
import TurnProgression from "../Components/TurnProgression";
import AwaitingStart from "../Components/AwaitingStart";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";


class PlayerUi extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rolePassword: '',
    };
  }

  updateSelectedWargame = (wargamePath) => {
    this.props.dispatch(getWargame(wargamePath));
  };

  goBack = () => {
    this.props.dispatch(setForce(""));
  };

  initiateGameplay = () => {
    this.props.dispatch(initiateGame(this.props.playerUi.currentWargame));
  };

  setRolePassword = (e) => {
    this.setState({
      rolePassword: e.target.value,
    });
  };

  setRolePasswordDemo = (pass) => {
    this.setState({
      rolePassword: pass,
    });
  };

  checkPassword = () => {
    let pass = this.state.rolePassword;

    let matchRole = (force) => force.roles.find((role) => role.password === pass);

    let force = this.props.playerUi.allForces[_.findIndex(this.props.playerUi.allForces, matchRole)];

    if (force === undefined) {
      this.props.dispatch(addNotification("Password did not match", "warning"));
      return;
    }

    let role = force.roles[_.findIndex(force.roles, (role) => role.password === pass)];

    this.props.dispatch(setForce(force.uniqid));
    this.props.dispatch(setRole(role));
    this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
  };

  render() {

    let getRoles = (force) => force.roles;
    let roleOptions = _.flatMap(this.props.playerUi.allForces, getRoles).map((role) => ({option: role.name, value: role.password}));

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

          {this.props.playerUi.currentWargame && !this.props.playerUi.selectedForce &&
            <div className="flex-content--center">
              <h1>Password</h1>
              <input
                autoFocus
                className="modal-input"
                type="text"
                onChange={this.setRolePassword}
                value={this.state.rolePassword || ''}
              />

              <h2>Dropdown for demo only</h2>
              <DropdownInput
                updateStore={this.setRolePasswordDemo}
                selectOptions={roleOptions}
              />
              <button name="add" disabled={!this.state.rolePassword} className="btn btn-action btn-action--primary" onClick={this.checkPassword}>Enter</button>
            </div>
          }

          {this.props.playerUi.selectedForce && this.props.playerUi.selectedRole && this.props.playerUi.wargameInitiated &&
            <div className="flex-content flex-content--row-wrap">
              <div className="message-feed">
                <ChannelTabsContainer />
              </div>
              <div className="message-feed out-of-game-feed">
                <TurnProgression />
                <OutOfGameFeed />
              </div>
            </div>
          }

          {this.props.playerUi.selectedForce && this.props.playerUi.selectedRole && !this.props.playerUi.wargameInitiated &&
            <div className="pre-start-screen">
              {this.props.playerUi.controlUi ?
                <button name="delete" className="btn btn-action btn-action--primary" onClick={this.initiateGameplay}>Start Game</button>
              : <AwaitingStart description={this.props.playerUi.gameDescription} />}
            </div>
          }

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
