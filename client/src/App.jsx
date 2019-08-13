import React, { Component } from 'react';
import { Provider } from 'react-redux';
import ModalSwitch from "./Components/Modals/ModalSwitch";
import Notifications from "./Components/Notifications";
import Version from "./Views/Version";
import RouterMain from "./Components/Router/RouterMain";
import './scss/App.scss';
import Store from './Store/Store';

class App extends Component {
  componentDidMount() {
    document.title = "Serge";
  }

  render() {
    return (
        <Provider store={Store}>
          <RouterMain />
          <ModalSwitch />
          <Notifications />
          <Version />
        </Provider>
    );
  }
}

export default App;
