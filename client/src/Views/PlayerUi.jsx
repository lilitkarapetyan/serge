import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";
import '../scss/App.scss';
import {
  getWargame,
  setForce,
  setRole,
  initiateGame,
  showHideObjectives,
  startListening,
  setAllTemplates,
  failedLoginFeedbackMessage,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import lineBreak from "../Helpers/splitNewLineBreak";
import {
  addNotification,
} from "../ActionsAndReducers/Notification/Notification_ActionCreators";

import DropdownInput from "../Components/Inputs/DropdownInput";
import GameChannels from "./GameChannels";
import TextInput from "../Components/Inputs/TextInput";
import {getSergeGameInformation} from "../ActionsAndReducers/sergeInfo/sergeInfo_ActionCreators";
import {umpireForceTemplate} from "../consts";
import {populateWargameStore} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import {populateMessageTypesDb} from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";

class PlayerUi extends Component {

  constructor(props) {
    super(props);

    this.state = {
      landingScreen: true,
      selectedWargame: '',
      wargameAccessCode: '',
      rolePassword: '',
    };

    this.props.dispatch(populateMessageTypesDb());
    this.props.dispatch(populateWargameStore());
    this.props.dispatch(getSergeGameInformation());
  };

  updateSelectedWargame = (selectedWargame) => {
    this.setState({selectedWargame});
    this.props.dispatch(getWargame(selectedWargame));
  };

  goBack = () => {
    this.props.dispatch(setForce(""));
  };

  initiateGameplay = () => {
    this.props.dispatch(initiateGame(this.props.playerUi.currentWargame));
  };

  setRolePassword = (value) => {
    this.setState({
      rolePassword: value,
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
      this.props.dispatch(addNotification("Access code incorrect", "warning"));
      this.props.dispatch(failedLoginFeedbackMessage(this.props.playerUi.currentWargame, pass));
      return;
    }

    let role = force.roles[_.findIndex(force.roles, (role) => role.password === pass)];

    this.props.dispatch(setForce(force.uniqid));
    this.props.dispatch(setRole(role));
    this.props.dispatch(setAllTemplates(this.props.messageTypes.messages));
    this.props.dispatch(startListening(this.props.playerUi.currentWargame));
  };

  roleOptions() {
    return this.props.playerUi.allForces.map((force) => ({name: force.name, roles: force.roles}));
  }

  showHideForceObjectives = () => {
    this.props.dispatch(showHideObjectives());
  };

  enterSerge = () => {
    this.setState({
      landingScreen: false,
    })
  };

  render() {

    if (this.state.landingScreen) {
      return (
        <div className="flex-content-wrapper flex-content-wrapper--welcome">
          <div className="flex-content flex-content--welcome">
            <div className="flex-content--center">
              <img className="serge-logo" src={this.props.gameInfo.imageUrl} alt="Serge gaming" />
              <h1>{this.props.gameInfo.title}</h1>
              {lineBreak(this.props.gameInfo.description)}
              <button name="play" className="btn btn-action btn-action--primary" onClick={this.enterSerge}>Play</button>
            </div>
          </div>
        </div>
      );
    }

    if (this.props.playerUi.selectedForce === umpireForceTemplate.uniqid && !this.props.playerUi.wargameInitiated) {
      return (
        <div className="flex-content-wrapper">
          <div className="pre-start-screen">
            <button name="initate game" className="btn btn-action btn-action--primary" onClick={this.initiateGameplay}>Initiate Game</button>
          </div>
        </div>
      )
    }

    if (this.props.playerUi.selectedForce && this.props.playerUi.selectedRole) {
      return (
        <div className="flex-content-wrapper">
          <div className="flex-content flex-content--fill">
            <GameChannels />
          </div>
        </div>
      )
    }

    return (
      <div className="flex-content-wrapper flex-content-wrapper--welcome">
        <div className="flex-content flex-content--welcome">
          {!this.props.playerUi.selectedForce && !this.props.playerUi.selectedRole &&
            <div className="flex-content--center">
              <h1>Set wargame</h1>
              <DropdownInput
                data={this.state.selectedWargame}
                updateStore={this.updateSelectedWargame}
                selectOptions={this.props.wargame.wargameList.map((wargame) => ({option: wargame.title, value: wargame.name}))}
              />
              <div className="flex-content">
                <TextInput
                  label="Access code"
                  className="material-input"
                  updateStore={this.setRolePassword}
                  options={{numInput: false}}
                  data={this.state.rolePassword || ''}
                />
              </div>
              {this.state.selectedWargame &&
                <div className="demo-passwords">
                  <h3>Not visible in production</h3>
                  {this.roleOptions().map((force) => {
                    return (
                      <React.Fragment key={force.name}>
                        <h4>{force.name}</h4>
                        <ul>
                          {force.roles.map((role) => (<li key={role.name} onClick={this.setRolePasswordDemo.bind(this, role.password)}>{role.name}</li>))}
                        </ul>
                      </React.Fragment>
                    )
                  })
                  }
                </div>
              }
              <button name="add" disabled={!this.state.rolePassword} className="btn btn-action btn-action--primary" onClick={this.checkPassword}>Enter</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ playerUi, wargame, messageTypes, gameInfo }) => ({
  playerUi,
  wargame,
  messageTypes,
  gameInfo,
});

export default connect(mapStateToProps)(PlayerUi);
