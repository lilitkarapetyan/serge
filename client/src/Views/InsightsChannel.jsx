import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  getAllWargameFeedback,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import '../scss/App.scss';
import MessagesListInsightsChannel from "./MessagesListInsightsChannel";
import MessagesListRenderProp from "./MessagesListRenderProp";

import {LOCAL_STORAGE_TIMEOUT, expiredStorage} from "../consts";

class InsightsChannel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: Object.keys(this.props.playerUi.channels)[0],
      allMarkedRead: false,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let channelLength = Object.keys(this.props.playerUi.feedbackMessages).length;
    let nextChannelLength = Object.keys(nextProps.playerUi.feedbackMessages).length;

    if (channelLength !== nextChannelLength) {
      this.setState({allMarkedRead: false});
    }

  }

  componentWillMount() {
    this.props.dispatch(getAllWargameFeedback(this.props.playerUi.currentWargame));
  }

  markAllAsRead = () => {
    this.props.playerUi.feedbackMessages.forEach((message) => {
      expiredStorage.setItem(this.props.playerUi.currentWargame + message._id, "read", LOCAL_STORAGE_TIMEOUT);
    });
    this.setState({
      allMarkedRead: true,
    })
  };

  render() {
    return (
      <MessagesListRenderProp
        curChannel={"feedback_messages"}
        messages={this.props.playerUi.feedbackMessages}
        userId={`${this.props.playerUi.wargameTitle}-${this.props.playerUi.selectedForce}-${this.props.playerUi.selectedRole}`}
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

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(InsightsChannel);
