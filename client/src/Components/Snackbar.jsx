import React, { Component } from 'react';

import '../scss/App.scss';

import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

    return (
      <>
        <div id="notification" className='active' key={this.props.data.id}>
          {this.props.data.message}<FontAwesomeIcon icon={faTimes} onClick={this.onClickHandler} />
        </div>
      </>
    );
  }
}


export default Snackbar;
