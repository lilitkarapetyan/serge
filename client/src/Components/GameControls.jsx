import React, { Component } from "react";
import { nextGameTurn } from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import { PlayerStateContext } from "../Store/PlayerUi";
import "../scss/App.scss";

class GameControls extends Component {
  static contextType = PlayerStateContext;

  nextTurn = () => {
    const [ state, dispatch ] = this.context;
    dispatch(nextGameTurn(state.currentWargame));
  };

  render() {
    return (
      <>
        <span className="link link--noIcon link--next-turn" onClick={this.nextTurn}>Start next phase</span>
      </>
    );
  }
}

export default GameControls;
