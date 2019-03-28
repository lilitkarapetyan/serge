import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DeleteModal from "./Components/Modals/DeleteModal.jsx";

import Router from "./Components/Router";

import './scss/App.scss';

import Store from './Store/Store';


class App extends Component {
  render() {
    return (
        <Provider store={Store}>
          <Router />
          <DeleteModal/>
        </Provider>
    );
  }
}

export default App;
