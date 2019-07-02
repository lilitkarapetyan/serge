import React, { Component } from 'react';
import '../scss/App.scss';
import {connect} from "react-redux";
import GameControls from "../Components/GameControls";
import _ from "lodash";
import classNames from "classnames";
import moment from "moment";
import {faCommentAlt, faShoePrints} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { modalAction } from "../ActionsAndReducers/Modal/Modal_ActionCreators";
import {ADJUDICATION_PHASE, PLANNING_PHASE} from "../consts";
import {openTour} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

class TurnProgression extends Component {

  constructor(props) {
    super(props);

    let now = Math.floor(new Date().getTime() / 1000);
    let end = Math.round(new Date(this.props.playerUi.turnEndTime).getTime()/1000);

    let seconds = end - now;

    if (this.props.playerUi.phase === PLANNING_PHASE) {
      this.state = {
        minutesLeft: ('0' + Math.floor(seconds / 60)).slice(-2),
        secondsLeft: ('0' + Math.floor(seconds % 60)).slice(-2),
        ended: false,
      };
      this.interval = setInterval(this.timer, 1000);
    }

    if (this.props.playerUi.phase === ADJUDICATION_PHASE) {
      this.state = {
        minutesLeft: '00',
        secondsLeft: '00',
        ended: false,
        startTime: Math.round(new Date(this.props.playerUi.adjudicationStartTime).getTime()/1000),
      };

      this.interval = setInterval(this.countup, 1000);
    }

  }

  componentWillReceiveProps(nextProps, nextContext) {

    if (
      nextProps.playerUi.phase === PLANNING_PHASE &&
      nextProps.playerUi.phase !== this.props.playerUi.phase
    ) {
      this.clearInterval();
      this.interval = setInterval(this.timer, 1000);
    }

    if (
      nextProps.playerUi.phase === ADJUDICATION_PHASE &&
      nextProps.playerUi.phase !== this.props.playerUi.phase
    ) {
      this.setState({
        minutesUp: '00',
        secondsUp: '00',
        startTime: Math.round(new Date(nextProps.playerUi.adjudicationStartTime).getTime()/1000),
      });
      this.clearInterval();
      this.interval = setInterval(this.countup, 1000);
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (
      nextState.minutesLeft === '00' &&
      nextState.secondsLeft === '00' &&
      !this.state.ended &&
      nextProps.playerUi.phase === PLANNING_PHASE
    ) {
      this.setState({
        ended: true,
      });
      _.debounce(() => this.interval = setInterval(this.timer, 1000));
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

  countup = () => {

    let now = Math.floor(new Date().getTime() / 1000);

    let seconds = now - this.state.startTime;

    let minutesUp = Math.floor(seconds / 60);
        minutesUp = minutesUp < 100 ? ('0' + minutesUp).slice(-2) : minutesUp;

    this.setState({
      minutesUp,
      secondsUp: ('0' + Math.round(seconds % 60)).slice(-2),
    })
  };


  clearInterval = () => {
    this.setState({
      ended: false,
      warning: false,
    });
    clearInterval(this.interval);
  };

  showLessonsModal = () => {
    this.props.dispatch(modalAction.open("lessons"));
  };

  openTour = () => {
    this.props.dispatch(openTour(true));
  };

  render() {

    let adjudicationPhase = this.props.playerUi.phase === ADJUDICATION_PHASE;

    return (
      <>
        <div className="flex-content wargame-title">
          <h3>{this.props.playerUi.wargameTitle}</h3>
          {
            <span onClick={this.showLessonsModal} className="wargame-title-icon" data-tour="third-step">
              <strong className="sr-only">Show lesson</strong>
            </span>
          }
          <FontAwesomeIcon icon={faShoePrints} size="2x" onClick={this.openTour} data-tour="third-step" />
        </div>
        
        {/* <<<<<<< ui_dark
        <div className={classNames({"flex-content-wrapper": true, "turn-progression-ui": true, "adjunction-phase": adjunctionPhase})} data-tour="sixth-step">
          <div className="turn-info-phase">
            <h5>Turn {this.props.playerUi.currentTurn} - {this.props.playerUi.phase} phase</h5>
            <time dateTime={this.props.playerUi.gameDate}>{moment(this.props.playerUi.gameDate).format("DD/MM/YYYY HH:mm")}</time>
          </div>
          <div className="turn-info-remaining text-center">
            <span className={classNames({"time-left": true, "ended": this.state.ended, "warning": this.state.warning})}>{this.state.minutesLeft}:{this.state.secondsLeft}</span>
            <span className="info-helper">Time left</span>
            {this.props.playerUi.controlUi ? <GameControls /> : false}
            
            we've made some changes to the turn progression UI and functionality, I think it's broken your design so i've left the code here commented for your convenience
======= */}
        <div className={classNames({"flex-content-wrapper": true, "turn-progression-ui": true, "adjudication-phase": adjudicationPhase})} data-tour="sixth-step">
          <div>
            <h5>Turn {this.props.playerUi.currentTurn}</h5>
            <h5>{moment(this.props.playerUi.gameDate).format("DD/MM/YYYY HH:mm")}</h5>
            {this.props.playerUi.controlUi ? <GameControls /> : false}
          </div>
          <div>
            <h3 className="time-left">{this.props.playerUi.phase} phase</h3>
            {this.props.playerUi.phase === PLANNING_PHASE &&
              <>
                <h2 className={classNames({"time-left": true, "ended": this.state.ended, "warning": this.state.warning})}>{this.state.minutesLeft}:{this.state.secondsLeft}</h2>
                <h3 className="time-left">Left</h3>
              </>
            }
            {this.props.playerUi.phase === ADJUDICATION_PHASE &&
              <>
                <h2 className="time-left">{this.state.minutesUp}:{this.state.secondsUp}</h2>
                <h3 className="time-left">Elapsed</h3>
              </>
            }
          </div>
        </div>
      </>
    );
  }
}


const mapStateToProps = ({playerUi}) => ({
  playerUi,
});

export default connect(mapStateToProps)(TurnProgression);
