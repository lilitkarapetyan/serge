import React, { Component } from 'react';
import {connect} from 'react-redux';

import UniversalRouter from "universal-router";

import ChooseInterface from "../Views/ChooseInterface";
import GameDesignerInterface from '../Views/GameDesignerInterface';
import UmpireMenu from '../Views/UmpireMenu';
import EditMessage from '../Views/EditMessage';
import CreateMessage from '../Views/CreateMessage';
import EditTemplate from '../Views/EditTemplate';
import CreateTemplate from '../Views/CreateTemplate';
import GameSetup from "../Views/GameSetup";
import PlayerUi from "../Views/PlayerUi";

import '../scss/App.scss';
// import {setCurrentViewFromURI} from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_ActionCreators";

class Router extends Component {

  constructor(props) {
    super(props);
    //
    // let path = new URL(window.location.href).pathname;
    //
    // this.props.dispatch(setCurrentViewFromURI(path));

    this.routes = [
      { path: '/client', action: () => <ChooseInterface /> },
      { path: '/client/umpireMenu', action: () => <GameDesignerInterface/> },
      { path: '/client/umpireMenu/:creatorType', action: () => <UmpireMenu /> },
      { path: '/client/messageCreator', children: [
          { path: '/create/template', action: () => <CreateTemplate /> },
          { path: '/edit/template', action: () => <EditTemplate /> },
          { path: '/create/message', action: () => <CreateMessage /> },
          { path: '/edit/message', action: () => <EditMessage /> },
        ]
      },
      { path: '/client/gameSetup', action: () => <GameSetup /> },
      { path: '/client/playerUi', action: () => <PlayerUi /> },
    ];

    // let currentPath = new URL(window.location.href).pathname;

    this.state = {
      currentView: <ChooseInterface />
    };

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
