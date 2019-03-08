import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from 'react-router-dom';

import logo from './logo.svg';
import './scss/App.scss';

import Store from './Store/Store';
import Welcome from './Views/Welcome';
import About from './Views/About';

class App extends Component {
  render() {
    return (
        <Provider store={Store}>
          <Router>
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
              </header>
              <Route exact path="/" component={Welcome} />
              <Route path="/about" component={About} />
            </div>
          </Router>
        </Provider>
    );
  }
}

export default App;
