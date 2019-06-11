import React, { Component } from 'react';
import { connect } from "react-redux";
import FlexLayout from "flexlayout-react";
import GameAdmin from "./GameAdmin";
import InsightsChannel from "./InsightsChannel";
import "../scss/dependencies/flexlayout-react.scss";
import '../scss/App.scss';

var json = {
  global: {
    tabSetTabStripHeight: 45,
    tabEnableClose: false,
    tabEnableRenderOnDemand: false,
    tabEnableDrag: false,
  },
  borders: [],
  layout:{
    "type": "row",
    "weight": 100,
    "children": [
    ]
  }
};



class AdminAndInsightsTabsContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameAdmin: 'GameAdmin',
      insights: 'Insights',
      model: FlexLayout.Model.fromJson(json),
      channelNames: [],
    };
  }

  componentWillMount() {
    this.addTabs();
  }

  addTabs() {
    this.state.model.doAction(
      FlexLayout.Actions.addNode({type: "tab", component: this.state.gameAdmin, name: this.state.gameAdmin, id: this.state.gameAdmin}, "#2", FlexLayout.DockLocation.CENTER, -1)
    );

    if (this.props.playerUi.controlUi) {
      this.state.model.doAction(
        FlexLayout.Actions.addNode({type: "tab", component: this.state.insights, name: this.state.insights, id: this.state.insights}, "#2", FlexLayout.DockLocation.CENTER, -1)
      );
    }
  }


  factory = (node) => {
    if (node.getName() === this.state.gameAdmin) {
      return <GameAdmin />
    }
    if (node.getName() === this.state.insights) {
      return <InsightsChannel />
    }
  };

  render() {
    return (
      <>
        <FlexLayout.Layout
          model={this.state.model}
          factory={this.factory}
        />
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(AdminAndInsightsTabsContainer);
