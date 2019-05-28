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
      {
        "type": "tabset",
        "id": "tabset",
        "weight": 150,
        "selected": 0,
        "children": [
          {
            "type": "tab",
            "id": "default",
            "name": "default",
            "component":"grid",
          },
        ]
      }
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

  componentWillMount() {

    this.state.channelNames.forEach((channelName) => {
      this.state.model.doAction(
        FlexLayout.Actions.addNode({type: "tab", component: channelName, name: channelName, id: channelName}, "tabset", FlexLayout.DockLocation.CENTER, 0)
      );
    });

    this.state.model.doAction(
      FlexLayout.Actions.deleteTab("default")
    );
  }

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
        FlexLayout.Actions.addNode({type: "tab", component: channelName, name: channelName, id: channelName}, "#2", FlexLayout.DockLocation.CENTER, 0)
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

  flexLayoutFactory = (node) => {

    let component = node.getComponent();

    console.log(component);

    let curChannelEntry = Object.entries(this.props.playerUi.channels).find((entry) => entry[1].name === node.getName());

    return <Channel channel={curChannelEntry[0]} />
    // switch (node.getName()) {
    //   case "Channel One":
    //     return <h1>Channel One</h1>;
    //     break;
    //
    //   case "Channel Two":
    //     return <h1>Channel Two</h1>;
    //     break;
    //
    //   case "Channel Three":
    //     return <h1>Channel Three</h1>;
    //     break;
    //
    //   default:
    //     return <h1>default</h1>;
    //     break;
    // }
  };

  render() {

    return (
      <>
        <FlexLayout.Layout
          model={this.state.model}
          factory={this.flexLayoutFactory}
        />
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(ChannelTabsContainer);
