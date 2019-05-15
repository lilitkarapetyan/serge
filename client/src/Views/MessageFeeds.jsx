import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  getAllWargameMessages,
  setChannel,
  setMessageSchema,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessagesList from "./MessagesList";
import NewMessage from "../Components/NewMessage";

import '../scss/App.scss';
import classNames from "classnames";


class MessageFeeds extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: Object.keys(this.props.playerUi.channels)[0],
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let channelLength = Object.keys(this.props.playerUi.channels).length;
    let nextChannelLength = Object.keys(nextProps.playerUi.channels).length;

    if (channelLength !== nextChannelLength) this.forceUpdate();
  }

  componentWillMount() {
    this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
  }

  createMessageList = () => {

    let curChannel= this.props.playerUi.selectedChannel;

    return (
      <>
        <MessagesList
          curChannel={curChannel}
          messages={this.props.playerUi.messages}
        />

        <NewMessage
          curChannel={curChannel}
          schema={this.props.playerUi.messageSchema}
          templates={this.props.playerUi.channels[curChannel].templates}
        />
      </>
    )
  };

  changeTab = (channel) => {
    console.log(channel);
    this.setState({ activeTab: channel });
    this.props.dispatch(setChannel(channel));
    this.props.dispatch(setMessageSchema({}));
  };

  createTabs() {

    let channels = this.props.playerUi.channels;

    let tabs = [];
    for (let channel in channels) {
      tabs.push(
        <li key={channel}
            onClick={this.changeTab.bind(this, channel)}
            className={classNames({ "active-tab": channel === this.state.activeTab })}
        >{channel}</li>
      );
    }
    return tabs;
  }

  render() {

    return (
      <>
        <ul className="tab-nav">
          {this.createTabs()}
        </ul>
        {this.createMessageList()}
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(MessageFeeds);
