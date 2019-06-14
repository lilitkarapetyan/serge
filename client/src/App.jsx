import React, { Component } from 'react';

import { Provider } from 'react-redux';
import ModalSwitch from "./Components/Modals/ModalSwitch";
import Notifications from "./Components/Notifications";
import Version from "./Views/Version";

import Router from "./Components/Router";

import './scss/App.scss';
import Store from './Store/Store';


class App extends Component {

  componentDidMount() {
    document.title = "Serge";
  }

  render() {
    return (
        <Provider store={Store}>
          <Router />
          <ModalSwitch />
          <Notifications />
          <Version />
        </Provider>
    );
  }
}

export default App;
