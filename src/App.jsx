import React, { Component } from 'react';

import { Provider } from 'react-redux';
import ModalSwitch from "./Components/Modals/ModalSwitch";
import Notification from "./Components/Notification";

import Router from "./Components/Router";

import './scss/App.scss';
import Store from './Store/Store';


class App extends Component {
  render() {
    return (
        <Provider store={Store}>
          <Router />
          <ModalSwitch />
          <Notification />
        </Provider>
    );
  }
}

export default App;
