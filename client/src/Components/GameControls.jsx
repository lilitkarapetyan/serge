import React, { Component } from 'react';
import '../scss/App.scss';
import {connect} from "react-redux";

import {nextGameTurn} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

class GameControls extends Component {

  nextTurn = () => {
    // this.props.clearInterval();
    this.props.dispatch(nextGameTurn(this.props.playerUi.currentWargame));
  };

  render() {
    return (
      <>
        <span className="link link--noIcon link--next-turn" onClick={this.nextTurn}>Start next phase</span>
      </>
    );
  }
}


const mapStateToProps = ({playerUi}) => ({
  playerUi
});

export default connect(mapStateToProps)(GameControls);
