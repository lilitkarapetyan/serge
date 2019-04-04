import React, { Component } from 'react';
import {connect} from 'react-redux';

import UniversalRouter from "universal-router";

import GameDesignerInterface from '../Views/GameDesignerInterface';
import UmpireMenu from '../Views/UmpireMenu';
import EditMessage from '../Views/EditMessage';
import CreateMessage from '../Views/CreateMessage';
import EditTemplate from '../Views/EditTemplate';
import CreateTemplate from '../Views/CreateTemplate';

import '../scss/App.scss';

class Router extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentView: <GameDesignerInterface />
    };

    this.routes = [
      { path: '/', action: () => <GameDesignerInterface/> },
      { path: '/umpireMenu/:creatorType', action: () => <UmpireMenu /> },
      { path: '/messageCreator', children: [
          { path: '/create/template', action: () => <CreateTemplate /> },
          { path: '/edit/template', action: () => <EditTemplate /> },
          { path: '/create/message', action: () => <CreateMessage /> },
          { path: '/edit/message', action: () => <EditMessage /> },
        ]
      }
    ];

    this.router = new UniversalRouter(this.routes);

  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.router.resolve({ pathname: nextProps.currentViewURI }).then(result => {
      this.setState({
        currentView: result,
      });
    });
  }

  render() {
    return (
      <>
        { this.state.currentView }
      </>
    );
  }
}

const mapStateToProps = ({ currentViewURI }) => ({
  currentViewURI
});


export default connect(mapStateToProps)(Router);