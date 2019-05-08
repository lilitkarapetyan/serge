import React, { Component } from 'react';

import '../scss/App.scss';

import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import classNames from "classnames";

class Snackbar extends Component {

  onClickHandler = () => {
    this.props.onClickHandler(this.props.data.id);
  };

  componentWillMount() {
    this.timer = setTimeout(() => {
      this.props.onClickHandler(this.props.data.id);
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {

    let type = this.props.data.type ? this.props.data.type : '';
    let classes = "active" + " " + type;

    return (
      <>
        <div id="notification" className={classes} key={this.props.data.id}>
          {this.props.data.message}<FontAwesomeIcon icon={faTimes} onClick={this.onClickHandler} />
        </div>
      </>
    );
  }
}


export default Snackbar;
