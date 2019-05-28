import React, { Component } from 'react';
import { connect } from "react-redux";

import {
  getAllWargameMessages,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessageCreatorChatChannel from "../Components/MessageCreatorChatChannel";
import MessagesListChatChannel from "./MessagesListChatChannel";

import '../scss/App.scss';
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

    if (!nextProps.playerUi.channels[nextProps.playerUi.selectedChannel]) {
      this.changeTab(Object.keys(nextProps.playerUi.channels)[0]);
    }
  }

  componentWillMount() {
    this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
  }


  render() {

    return (
      <>
        <MessagesListRenderProp
          curChannel={this.props.playerUi.chatChannel.name}
          messages={this.props.playerUi.messages}
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
            <MessageCreatorChatChannel schema={this.props.playerUi.chatChannel.template} />
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
