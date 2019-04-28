import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';

import { hideNotification } from "../ActionsAndReducers/Notification/Notification_ActionCreators";

import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class Notification extends Component {

  onClickHandler = (e) => {

    this.props.dispatch(hideNotification());

  };

  render() {


    if (!this.props.notification.open) return false;

    return (
        <div id="notification">
          {this.props.notification.message}<FontAwesomeIcon icon={faTimes} onClick={this.onClickHandler} />
        </div>
    );
  }
}

const mapStateToProps = ({ notification }) => ({
  notification,
});

export default connect(mapStateToProps)(Notification);
