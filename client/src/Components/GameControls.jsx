import React, { Component } from 'react';
import '../scss/App.scss';
import {connect} from "react-redux";

import {nextGameTurn} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

class GameControls extends Component {

  constructor(props) {
    super(props);
  }

  nextTurn = () => {
    this.props.clearInterval();
    this.props.dispatch(nextGameTurn(this.props.playerUi.currentWargame));
  };

  render() {
    return (
      <>
        <span className="link link--noIcon link--next-turn" onClick={this.nextTurn}>Next game turn</span>
      </>
    );
  }
}


const mapStateToProps = ({playerUi}) => ({
  playerUi
});

export default connect(mapStateToProps)(GameControls);
