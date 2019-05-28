import React, { Component } from 'react';
import { connect } from "react-redux";
import FlexLayout from "flexlayout-react";
import Channel from "../Components/Channel";
import _ from "lodash";
import "../scss/dependencies/flexlayout-react.scss";
import '../scss/App.scss';

var json = {
  global: {
    tabSetTabStripHeight: 45,
    tabEnableClose: false,
    tabEnableRenderOnDemand: false,
  },
  borders: [],
  layout:{
    "type": "row",
    "weight": 100,
    "children": [
    ]
  }
};



class ChannelTabsContainer extends Component {

  constructor(props) {
    super(props);
    // this.model = FlexLayout.Model.fromJson(json);

    this.state = {
      model: FlexLayout.Model.fromJson(json),
      channelNames: [],
    };
  }

  // componentWillMount() {
  //
  //   this.state.channelNames.forEach((channelName) => {
  //     this.state.model.doAction(
  //       FlexLayout.Actions.addNode({type: "tab", component: channelName, name: channelName, id: channelName}, "tabset", FlexLayout.DockLocation.CENTER, -1)      );
  //   });
  //
  //   this.state.model.doAction(
  //     FlexLayout.Actions.deleteTab("default")
  //   );
  // }

  componentWillReceiveProps(nextProps, nextContext) {

    let channelLength = Object.keys(this.props.playerUi.channels).length;
    let nextChannelLength = Object.keys(nextProps.playerUi.channels).length;

    if (channelLength < nextChannelLength) {
      this.addToTabs(nextProps);
    }

    if (channelLength > nextChannelLength) {
      this.removeFromTabs(nextProps);
    }
  }


  addToTabs(nextProps) {

    let channelNames = Object.values(nextProps.playerUi.channels).map((channel) => channel.name);

    let newChannels = _.difference(channelNames, this.state.channelNames);

    newChannels.forEach((channelName) => {
      this.state.model.doAction(
        FlexLayout.Actions.addNode({type: "tab", component: channelName, name: channelName, id: channelName}, "#2", FlexLayout.DockLocation.CENTER, -1)
      );
    });

    this.setState({
      channelNames,
    })
  }

  removeFromTabs(nextProps) {

    let channelNames = Object.values(nextProps.playerUi.channels).map((channel) => channel.name);

    let channelsToRemove = _.difference(this.state.channelNames, channelNames);

    channelsToRemove.forEach((channelName) => {
      this.state.model.doAction(
        FlexLayout.Actions.deleteTab(channelName)
      );
    });

    this.setState({
      channelNames,
    })
  }

  factory = (node) => {

    let curChannelEntry = Object.entries(this.props.playerUi.channels).find((entry) => entry[1].name === node.getName());
    return <Channel channel={curChannelEntry[0]} />

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

export default connect(mapStateToProps)(ChannelTabsContainer);
