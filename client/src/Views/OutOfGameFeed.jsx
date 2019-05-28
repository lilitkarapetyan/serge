import React, { Component } from 'react';
import { connect } from "react-redux";

import {
  getAllWargameMessages,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessageCreatorChatChannel from "../Components/MessageCreatorChatChannel";
import MessagesListChatChannel from "./MessagesListChatChannel";

import {CHAT_CHANNEL_ID} from "../api/consts";
import '../scss/App.scss';
import classNames from "classnames";
import Collapsible from "react-collapsible";
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

  }

  componentWillMount() {
    this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
  }


  render() {

    return (
      <>
        <MessagesListRenderProp
          curChannel={CHAT_CHANNEL_ID}
          messages={this.props.playerUi.chatChannel.messages}
          render={messages => (
            <MessagesListChatChannel
              messages={messages}
            />
          )}
        />

        <div className="new-message-creator wrap">
          <Collapsible
            trigger={"New Message"}
            transitionTime={200}
            easing={'ease-in-out'}
          >
            <MessageCreatorChatChannel
              curChannel={CHAT_CHANNEL_ID}
              schema={this.props.playerUi.chatChannel.template}
            />
          </Collapsible>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(MessageFeeds);
