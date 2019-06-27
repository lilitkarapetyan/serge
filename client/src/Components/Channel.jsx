import React, { Component } from 'react';
import { connect } from "react-redux";

// import MessagesListChannel from "../Views/MessagesListChannel";
import MessageListItem from "../Components/MessageListItem";
import NewMessage from "./NewMessage";
import '../scss/App.scss';
import {
  closeMessage,
  getAllWargameMessages,
  openMessage,
  markAllAsRead,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import { umpireForceTemplate } from "../consts";

class Channel extends Component {

  componentWillMount() {
    if (this.props.playerUi.channels[this.props.channel].messages.length === 0) {
      this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
    }
  }

  markAllRead = () => {
    this.props.dispatch(markAllAsRead(this.props.channel));
  };

  openSection = (el) => {
    this.props.dispatch(openMessage(this.props.channel, el));
  };

  closeSection = (el) => {
    this.props.dispatch(closeMessage(this.props.channel, el));
  };

  render() {

    let curChannel = this.props.channel;

    return (
      <>
        <div className="forces-in-channel">
          {this.props.playerUi.channels[curChannel].forceIcons.map((url, i) => <img key={`indicator${i}`} className="force-indicator" src={url} alt="" />)}
          <button name="mark as read" className="btn btn-action btn-action--secondary" onClick={this.markAllRead}>Mark all read</button>
        </div>

        <div className="message-list">

          {this.props.playerUi.channels[curChannel].messages.map((item, i) => {

            if (item.infoType) {
              return <p className="turn-marker" key={`${i}-turnmarker`}>Turn {item.gameTurn}</p>
            }
            return (
              <MessageListItem
                detail={item}
                key={`${i}-messageitem`}
                openSection={this.openSection}
                closeSection={this.closeSection}
              />
            );
          })}
        </div>
        {
          this.props.playerUi.channels[curChannel].observing === false &&
          <NewMessage
            orderableChannel={true}
            curChannel={curChannel}
            privateMessage={this.props.playerUi.selectedForce === umpireForceTemplate.uniqid}
            templates={this.props.playerUi.channels[curChannel].templates}
          />
        }
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(Channel);
