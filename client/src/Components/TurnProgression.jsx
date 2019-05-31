import React, { Component } from 'react';
import '../scss/App.scss';
import {connect} from "react-redux";
import GameControls from "../Components/GameControls";

import classNames from "classnames";
import moment from "moment";

class TurnProgression extends Component {

  constructor(props) {
    super(props);

    let now = Math.floor(new Date().getTime() / 1000);
    let end = Math.round(new Date(this.props.playerUi.turnEndTime).getTime()/1000);

    let seconds = end - now;

    if (seconds > 0) {
      this.state = {
        minutesLeft: ('0' + Math.floor(seconds / 60)).slice(-2),
        secondsLeft: ('0' + Math.floor(seconds % 60)).slice(-2),
      };
      this.interval = setInterval(this.timer, 1000);
    } else {
      this.state = {
        minutesLeft: '00',
        secondsLeft: '00',
      };
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {

    if (this.props.playerUi.currentTurn !== nextProps.playerUi.currentTurn) {

      let now = Math.floor(new Date().getTime() / 1000);
      let end = Math.floor(nextProps.playerUi.turnEndTime / 1000) % 60;

      let seconds = end - now;

      let minutes = Math.floor(seconds / 60);
          minutes = minutes < 100 ? ('0' + minutes).slice(-2) : minutes;

      this.setState({
        minutesLeft: minutes,
        secondsLeft: ('0' + Math.floor(seconds % 60)).slice(-2),
      });

      this.interval = setInterval(this.timer, 1000);
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (nextState.minutesLeft === '00' && nextState.secondsLeft === '00' && !this.state.ended) {
      this.setState({
        ended: true,
      });
      this.interval = setInterval(this.timer, 1000);
    }
  }

  timer = () => {

    if (this.state.secondsLeft === '00' && this.state.minutesLeft === '00') this.setState({ended: true});

    let now = Math.floor(new Date().getTime() / 1000);
    let end = Math.round(new Date(this.props.playerUi.turnEndTime).getTime() / 1000);

    let seconds;

    if (this.state.ended) {
      seconds = now - end;
    } else {
      seconds = end - now;
    }
    if (seconds < (this.props.playerUi.timeWarning / 1000)) this.setState({warning: true});

    let minutesLeft = Math.floor(seconds / 60);
        minutesLeft = minutesLeft < 100 ? ('0' + minutesLeft).slice(-2) : minutesLeft;

    this.setState({
      minutesLeft,
      secondsLeft: ('0' + Math.round(seconds % 60)).slice(-2),
    })
  };

  clearInterval = () => {
    this.setState({
      ended: false,
      warning: false,
    });
    clearInterval(this.interval);
  };


  render() {
    return (
      <div className="flex-content-wrapper turn-progression-ui">
        <div className="flex-content--turn-progression">
          <h4>{moment(this.props.playerUi.gameDate).format("DD/MM/YYYY")}</h4>
          <h4>{moment(this.props.playerUi.gameDate).format("HH:mm")}</h4>
        </div>
        <div className="flex-content--turn-progression">
          <h3>Turn {this.props.playerUi.currentTurn}</h3>
          <h3 className={classNames({"time-left": true, "ended": this.state.ended, "warning": this.state.warning})}>{this.state.minutesLeft}:{this.state.secondsLeft}</h3><span>left</span>
          {this.props.playerUi.controlUi ? <GameControls clearInterval={this.clearInterval} /> : false}
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({playerUi}) => ({
  playerUi,
});

export default connect(mapStateToProps)(TurnProgression);
