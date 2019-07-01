import React, { Component } from 'react';
import { connect } from "react-redux";

import MessageCreatorChatChannel from "../Components/MessageCreatorChatChannel";
import MessagesListChatChannel from "./MessagesListChatChannel";

import {CHAT_CHANNEL_ID, expiredStorage, LOCAL_STORAGE_TIMEOUT} from "../consts";
import '../scss/App.scss';
import Collapsible from "react-collapsible";
import MessagesListRenderProp from "./MessagesListRenderProp";


class GameAdmin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: Object.keys(this.props.playerUi.channels)[0],
      allMarkedRead: false,
      showObjectives: false,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let channelLength = Object.keys(this.props.playerUi.chatChannel.messages).length;
    let nextChannelLength = Object.keys(nextProps.playerUi.chatChannel.messages).length;

    if (channelLength !== nextChannelLength) {
      this.setState({allMarkedRead: false});
    }

  }

  markAllAsRead = () => {
    this.props.playerUi.chatChannel.messages.forEach((message) => {
      expiredStorage.setItem(this.props.playerUi.currentWargame + message._id, "read", LOCAL_STORAGE_TIMEOUT);
    });
    this.setState({
      allMarkedRead: true,
    })
  };


  render() {

    return (
      <>
        <MessagesListRenderProp
          curChannel={CHAT_CHANNEL_ID}
          messages={this.props.playerUi.chatChannel.messages}
          userId={`${this.props.playerUi.wargameTitle}-${this.props.playerUi.selectedForce}-${this.props.playerUi.selectedRole}`}
          allMarkedRead={this.state.allMarkedRead}
          render={messages => (
            <MessagesListChatChannel
              messages={messages}
              markAllAsRead={this.markAllAsRead}
            />
          )}
        />

        <div className="new-message-creator wrap" data-tour="seventh-step">
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

export default connect(mapStateToProps)(GameAdmin);
