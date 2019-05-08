import React, { Component } from 'react';
import { connect } from "react-redux";

import '../scss/App.scss';
import {
  getWargame,
  setForce,
  setRole,
  setFilteredChannels,
  // getAllMessages,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessageFeeds from "./MessageFeeds";
import DropdownInput from "../Components/Inputs/DropdownInput";

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

  updateSelectedRole = (role) => {
    this.props.dispatch(setRole(role));
    this.props.dispatch(setFilteredChannels());
  };

  goBack = () => {
    this.props.dispatch(setForce(""));
  };

  render() {

    return (
      <div className="flex-content-wrapper">

        <div className="flex-content flex-content--fill">

          {!this.props.playerUi.currentWargame ?
            <div className="flex-content--center">
              <h1>Set wargame</h1>
              <DropdownInput
                updateStore={this.updateSelectedWargame}
                selectOptions={this.props.wargame.wargameList.map((wargame) => ({option: wargame.title, value: wargame.name}))}
              />
            </div>
            : false
          }

          {this.props.playerUi.currentWargame && !this.props.playerUi.selectedForce ?
            <div className="flex-content--center">
              <h1>Set force</h1>
              <DropdownInput
                updateStore={this.updateSelectedForce}
                selectOptions={Object.keys(this.props.playerUi.allForces).map((force) => ({option: force, value: force}))}
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
                selectOptions={this.props.playerUi.allForces[this.props.playerUi.selectedForce].roles.map((role) => ({option: role, value: role}))}
              />
            </div>
            : false
          }

          {this.props.playerUi.selectedForce && this.props.playerUi.selectedRole ?

            <div className="message-feeds">
              <MessageFeeds />
            </div>
            : false
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
