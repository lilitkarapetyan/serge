import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';

import { hideNotification } from "../ActionsAndReducers/Notification/Notification_ActionCreators";

import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import classNames from "classnames";
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
});

class Notification extends Component {

  onClickHandler = (e) => {

    this.props.dispatch(hideNotification());

  };

  render() {

    if (!this.props.notification.open) return false;

    return (
      <Snackbar
        className={classNames({...this.props.margin, ...this.props.message})}
        action={[this.props.notification.message, <FontAwesomeIcon icon={faTimes} onClick={this.onClickHandler} />]}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        onClose={this.onClickHandler}
        open={this.props.notification.open}
        // autoHideDuration={2500}
      />
    );
  }
}

const mapStateToProps = ({ notification }) => ({
  notification,
});

export default connect(mapStateToProps)(withStyles(styles)(Notification));
