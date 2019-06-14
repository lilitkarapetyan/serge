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

    this.localStorage = window.localStorage;

    let model = this.localStorage.getItem('model');

    this.model = model ? FlexLayout.Model.fromJson(JSON.parse(model)) : FlexLayout.Model.fromJson(json);

    this.state = {
      channelNames: [],
      isSavedModel: !!model,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {

    let channelLength = Object.keys(this.props.playerUi.channels).length;
    let nextChannelLength = Object.keys(nextProps.playerUi.channels).length;

    if (this.state.isSavedModel) {
      return;
    }

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
      this.model.doAction(
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
      this.model.doAction(
        FlexLayout.Actions.deleteTab(channelName)
      );
    });

    this.setState({
      channelNames,
    })
  }

  factory = (node) => {

    if (_.isEmpty(this.props.playerUi.channels)) return;
    let curChannelEntry = Object.entries(this.props.playerUi.channels).find((entry) => entry[1].name === node.getName());
    return <Channel channel={curChannelEntry[0]} />

  };

  modelChanged = () => {
    this.localStorage.setItem('model', JSON.stringify(this.model.toJson()));
  };

  render() {
    return (
      <>
        <FlexLayout.Layout
          model={this.model}
          factory={this.factory}
          onModelChange={this.modelChanged}
        />
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(ChannelTabsContainer);
