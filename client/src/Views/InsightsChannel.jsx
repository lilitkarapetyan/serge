import React, { Component } from "react";
import {LOCAL_STORAGE_TIMEOUT, expiredStorage} from "../consts";
import { getAllWargameFeedback } from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import { PlayerStateContext } from "../Store/PlayerUi";
import MessagesListInsightsChannel from "./MessagesListInsightsChannel";
import MessagesListRenderProp from "./MessagesListRenderProp";
import "../scss/App.scss";

class InsightsChannel extends Component {
  static contextType = PlayerStateContext;

  constructor(props, context) {
    super(props);
    const [ state ] = this.context;
    this.state = {
      activeTab: Object.keys(state.channels)[0],
      allMarkedRead: false,
    };
  }

  componentDidMount() {
    const [ state, dispatch ] = this.context;
    let channelLength = Object.keys(state.feedbackMessages).length;

    if (channelLength) {
      this.setState({allMarkedRead: false});
    }

    getAllWargameFeedback(state.currentWargame)(dispatch);
  }

  markAllAsRead = () => {
    const [ state ] = this.context;
    state.feedbackMessages.forEach((message) => {
      expiredStorage.setItem(state.currentWargame + message._id, "read", LOCAL_STORAGE_TIMEOUT);
    });
    this.setState({
      allMarkedRead: true,
    })
  };

  render() {
    const [ state ] = this.context;

    return (
      <MessagesListRenderProp
        curChannel={"feedback_messages"}
        messages={state.feedbackMessages}
        userId={`${state.wargameTitle}-${state.selectedForce}-${state.selectedRole}`}
        allMarkedRead={this.state.allMarkedRead}
        render={messages => (
          <MessagesListInsightsChannel
            messages={messages}
            markAllAsRead={this.markAllAsRead}
          />
        )}
      />
    );
  }
}

export default InsightsChannel;
