import React, { Component } from 'react';
import { connect } from "react-redux";
import FlexLayout from "flexlayout-react";
import GameAdmin from "./GameAdmin";
import InsightsChannel from "./InsightsChannel";
import "../scss/dependencies/flexlayout-react.scss";
import '../scss/App.scss';


import {
  showHideObjectives
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import _ from "lodash";

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
      gameAdmin: 'Game Admin',
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

    if (this.props.playerUi.isInsightViewer) {
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


  showHideForceObjectives = () => {
    this.props.dispatch(showHideObjectives());
  };

  render() {

    let force = this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce);

    return (
      <>
        <FlexLayout.Layout
          model={this.state.model}
          factory={this.factory}
        />
        <div className="role-info" data-tour="second-step">
          <span className="role-type">{ this.props.playerUi.selectedRole }</span>
          <div className="contain-force-skin">
            <div className="force-skin">
              <span className="force-type">{ force.name }</span>
              <img className="role-icon" src={force.icon} alt="" onClick={this.showHideForceObjectives} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(AdminAndInsightsTabsContainer);
