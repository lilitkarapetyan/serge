import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DeleteModal from "./Components/Modals/DeleteModal.jsx";

import Router from "./Components/Router";

import './scss/App.scss';

import Store from './Store/Store';
// import GameDesignerInterface from './Views/GameDesignerInterface';
// import MessageUIContainer from './Views/MessageUIContainer';
// import EditMessage from './Views/EditMessage';
// import EditTemplate from './Views/EditTemplate';


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
