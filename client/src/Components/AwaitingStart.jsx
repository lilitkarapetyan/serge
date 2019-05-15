import React, { Component } from 'react';
import '../scss/App.scss';
import {connect} from "react-redux";


class AwaitingStart extends Component {


  render() {

    return (
      <>
        <div id="loading">
          <div>
            <div id="loader"></div>
          </div>
          <h1>Awaiting game start</h1>
        </div>
      </>
    );
  }
}

export default AwaitingStart;
