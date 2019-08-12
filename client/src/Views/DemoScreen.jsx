import React, { Component } from 'react';
import { connect } from "react-redux";
import FlexLayout from "flexlayout-react";
import { ADMIN_ROUTE, PLAYERUI_ROUTE } from "../consts";
import "../scss/dependencies/flexlayout-react.scss";
import '../scss/App.scss';

const json = {
  "global": {
    tabSetTabStripHeight: 45,
    tabEnableClose: false,
    tabEnableRenderOnDemand: false,
  },
  "layout": {
    "type": "row",
    "id": "#demo-row-main",
    "children": [
      {
        "type": "tabset",
        "id": "#demo-tabset-main",
        "children": [
          {
            "type": "tab",
            "id": "#demo-game-designer",
            "name": "Game Designer",
            "component": "game-designer",
          },
          {
            "type": "tab",
            "id": "#demo-player-1",
            "name": "Player",
            "component": "player",
          },
          {
            "type": "tab",
            "id": "#demo-player-2",
            "name": "Player",
            "component": "player",
          },
          {
            "type": "tab",
            "id": "#demo-player-3",
            "name": "Player",
            "component": "player",
          },
          {
            "type": "tab",
            "id": "#demo-player-4",
            "name": "Player",
            "component": "player",
          },
        ],
        "active": true
      }
    ]
  },
  "borders": []
};



class DemoScreen extends Component {

  constructor(props) {
    super(props);
    this.model = FlexLayout.Model.fromJson(json);
  }

  factory = (node) => {
    const component = node.getComponent();
    const sources = {
      'game-designer': ADMIN_ROUTE,
      'player': PLAYERUI_ROUTE,
    };
    return (
        <iframe className="demo-iframe" src={`${window.location.origin}${sources[component]}`}>
          Demo Screen { sources[component] }
        </iframe>
    );
  };

  tabRender = (node) => {
  };

  render() {
    return (
      <div className="flex-content-wrapper">
        <div className="flex-content flex-content--fill">
          <FlexLayout.Layout
            model={this.model}
            factory={this.factory}
            onRenderTab={this.tabRender}
          />
        </div>
      </div>
    );
  }
}

export default DemoScreen;
