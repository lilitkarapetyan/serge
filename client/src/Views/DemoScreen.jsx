import React, { Component } from "react";
import FlexLayout from "flexlayout-react";
import RouterDashboard from "../Components/Router/RouterDashboard";
import PlayerUiWrapper from "./PlayerUiWrapper";
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
        ],
        "active": true
      },
      {
        "type": "tabset",
        "id": "#demo-tabset-player-1",
        "children": [

          {
            "type": "tab",
            "id": "#demo-player-1",
            "name": "Player",
            "component": "player",
          },
        ],
        "active": true
      },
      {
        "type": "tabset",
        "id": "#demo-tabset-player-2",
        "children": [

          {
            "type": "tab",
            "id": "#demo-player-2",
            "name": "Player",
            "component": "player",
          },
        ],
        "active": true
      },
      {
        "type": "tabset",
        "id": "#demo-tabset-player-3",
        "children": [

          {
            "type": "tab",
            "id": "#demo-player-3",
            "name": "Player",
            "component": "player",
          },
        ],
        "active": true
      },
      {
        "type": "tabset",
        "id": "#demo-tabset-player-4",
        "children": [

          {
            "type": "tab",
            "id": "#demo-player-4",
            "name": "Player",
            "component": "player",
          },
        ],
        "active": true
      },
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
      'game-designer': <RouterDashboard/>,
      'player': <PlayerUiWrapper/>,
    };
    return sources[component];
  };

  classNameMapper = (defaultClassName) => `${defaultClassName} ${defaultClassName}--demo`;

  render() {
    return (
      <div className="flex-content-wrapper">
        <div className="flex-content flex-content--fill">
          <FlexLayout.Layout
            model={this.model}
            factory={this.factory}
            classNameMapper={this.classNameMapper}
            className="flex-layout-demo"
          />
        </div>
      </div>
    );
  }
}

export default DemoScreen;
