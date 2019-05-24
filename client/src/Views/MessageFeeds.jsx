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
import MessagesListRenderProp from "./MessagesListRenderProp";


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

    if (!nextProps.playerUi.channels[nextProps.playerUi.selectedChannel]) {
      this.changeTab(Object.keys(nextProps.playerUi.channels)[0]);
    }
  }

  componentWillMount() {
    this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
  }


  changeTab = (channel) => {
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
        >{channels[channel].name}</li>
      );
    }
    return tabs;
  }

  render() {

    let curChannel = this.props.playerUi.selectedChannel;

    return (
      <>
        <ul className="tab-nav">
          {this.createTabs()}
        </ul>
        <div className="forces-in-channel">
          {this.props.playerUi.channels[curChannel].forceIcons.map((base64, i) => <img key={`indicator${i}`} className="force-indicator" src={base64} />)}
        </div>

        <MessagesListRenderProp
          curChannel={curChannel}
          messages={this.props.playerUi.messages}
          render={(messages, actions) => (
            <MessagesList
              messages={messages}
              openSection={actions.openSection}
              closeSection={actions.closeSection}
            />
          )}
        />

        <NewMessage
          curChannel={curChannel}
          schema={this.props.playerUi.messageSchema}
          templates={this.props.playerUi.channels[curChannel].templates}
        />
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(MessageFeeds);
