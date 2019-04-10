import React, { Component } from 'react';
import {connect} from "react-redux";
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";

import '../../scss/App.scss';

class ForcesTab extends Component {

  constructor(props) {
    super(props);
  };

  openModal = () => {
    this.props.dispatch(modalAction.open("addForce"));
  };

  render() {
    return (
      <div className="flex-content-wrapper">

        <span className="link link--noIcon" onClick={this.openModal}>Add a new force</span>

      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ messages, gameSetup }) => ({
  messages,
  gameSetup,
});

export default connect(mapStateToProps)(ForcesTab);
