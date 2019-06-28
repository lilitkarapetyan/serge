import React, { Component } from 'react';
import { connect } from "react-redux";
import FlexLayout from "flexlayout-react";
import Channel from "../Components/Channel";
import _ from "lodash";
import "../scss/dependencies/flexlayout-react.scss";
import '../scss/App.scss';
import {getAllWargameMessages} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

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

    let modelName = `FlexLayout-model-${this.props.playerUi.wargameTitle}-${this.props.playerUi.selectedForce}-${this.props.playerUi.selectedRole}`;

    let model = this.localStorage.getItem(modelName);

    this.model = model ? FlexLayout.Model.fromJson(JSON.parse(model)) : FlexLayout.Model.fromJson(json);

    this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));

    this.state = {
      modelName,
    };
  }


  componentWillReceiveProps(nextProps, nextContext) {

    let channels = nextProps.playerUi.channels;
    let channelNames = [];

    for (let channelId in channels) {
      channelNames.push({id: channelId, name: channels[channelId].name});
    }

    let modelTabs = Object.values(this.model._idMap)
      .filter((node) => node._attributes.type === "tab")
      .map((node) => ({ id: node._attributes.id, name: node._attributes.name }));

    let newChannels = _.differenceBy(channelNames, modelTabs, (channel) => channel.id);
    let channelsToRemove = _.differenceBy(modelTabs, channelNames, (channel) => channel.id);

    let matchingChannels = _.intersectionBy(channelNames, modelTabs, (item) => item.id);
    let channelsToRename = _.differenceBy(matchingChannels, modelTabs, (item) => item.name);

    if (channelsToRename.length > 0) {
      this.renameTabs(channelsToRename);
    }

    if (newChannels.length > 0) {
      this.addToTabs(newChannels);
    }

    if (channelsToRemove.length > 0) {
      this.removeFromTabs(channelsToRemove);
    }
  }


  addToTabs(newChannels) {

    let modelTabs = Object.values(this.model._idMap);

    let tabsetMatch = modelTabs.find((tab) => tab._attributes.type === "tabset");
    let tabsetId = tabsetMatch._attributes.id;
    newChannels.forEach((channel) => {
      if (!this.model._idMap[channel.id]) {
        this.model.doAction(
          FlexLayout.Actions.addNode({type: "tab", component: channel.name, name: channel.name, id: channel.id}, tabsetId, FlexLayout.DockLocation.CENTER, -1)
        );
      }
    });
  }

  removeFromTabs(channelsToRemove) {

    channelsToRemove.forEach((channel) => {
      if (this.model._idMap[channel.id]) {
        this.model.doAction(
          FlexLayout.Actions.deleteTab(channel.id)
        );
      }
    });

    let modelTabs = Object.values(this.model._idMap)
      .filter((node) => node._attributes.type === "tab")
      .map((node) => ({ id: node._attributes.id, name: node._attributes.name }));

    if (modelTabs.length === 0) {
      this.addToTabs([{id: "default", name: "No subscriptions"}]);
    }
  }

  renameTabs(nameChanges) {
    nameChanges.forEach((channel) => {
      this.model.doAction(
        FlexLayout.Actions.updateNodeAttributes(channel.id, {name: channel.name})
      )
    })
  }

  factory = (node) => {

    if (_.isEmpty(this.props.playerUi.channels)) return;
    let curChannelEntry = Object.entries(this.props.playerUi.channels).find((entry) => entry[1].name === node.getName());
    return <Channel channel={curChannelEntry[0]} />

  };

  modelChanged = () => {
    this.localStorage.setItem(this.state.modelName, JSON.stringify(this.model.toJson()));
  };

  tabRender = (node) => {

    if (_.isEmpty(this.props.playerUi.channels)) return;

    let channel = Object.entries(this.props.playerUi.channels).find((entry) => entry[1].name === node.getName())[1];

    if (node._attributes.className !== "" && channel.unreadMessageCount === 0) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: ""}));
    }
    if (node._attributes.className !== "unread-1" && channel.unreadMessageCount === 1) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-1"}));
    }
    if (node._attributes.className !== "unread-2" && channel.unreadMessageCount === 2) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-2"}));
    }
    if (node._attributes.className !== "unread-3" && channel.unreadMessageCount === 3) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-3"}));
    }
    if (node._attributes.className !== "unread-4" && channel.unreadMessageCount === 4) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-4"}));
    }
    if (node._attributes.className !== "unread-5" && channel.unreadMessageCount === 5) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-5"}));
    }
    if (node._attributes.className !== "unread-6" && channel.unreadMessageCount === 6) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-6"}));
    }
    if (node._attributes.className !== "unread-7" && channel.unreadMessageCount === 7) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-7"}));
    }
    if (node._attributes.className !== "unread-8" && channel.unreadMessageCount === 8) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-8"}));
    }
    if (node._attributes.className !== "unread-9plus" && channel.unreadMessageCount >= 9) {
      node.getModel().doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {className: "unread-9plus"}));
    }
  };

  render() {

    // if (_.isEmpty(this.props.playerUi.channels)) {
    //   return (
    //     <div className="no-channel-notification">
    //       <h1>No Channels subscribed to.</h1>
    //     </div>
    //   )
    // }

    return (
      <>
        <FlexLayout.Layout
          model={this.model}
          factory={this.factory}
          onRenderTab={this.tabRender}
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
