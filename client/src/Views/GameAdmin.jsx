import React, { Component } from 'react';
import { connect } from "react-redux";

import {
  getAllWargameMessages,
  showHideObjectives,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessageCreatorChatChannel from "../Components/MessageCreatorChatChannel";
import MessagesListChatChannel from "./MessagesListChatChannel";

import {CHAT_CHANNEL_ID} from "../api/consts";
import '../scss/App.scss';
import Collapsible from "react-collapsible";
import MessagesListRenderProp from "./MessagesListRenderProp";


class GameAdmin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: Object.keys(this.props.playerUi.channels)[0],
      showObjectives: false,
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

  showHideForceObjectives = () => {
    this.props.dispatch(showHideObjectives());
  };

  render() {

    let forceName = this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce).name;
    let forceIcon = this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce).icon;

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
          <div className="role-info">
            <span className="role-type">{ this.props.playerUi.selectedRole }</span>
            <span className="force-type">{ forceName }</span>
            <img src={forceIcon} alt="" onClick={this.showHideForceObjectives} />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(GameAdmin);