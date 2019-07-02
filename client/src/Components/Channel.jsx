import React, { Component } from 'react';
import { connect } from "react-redux";
import MessageListItem from "../Components/MessageListItem";
import NewMessage from "./NewMessage";
import '../scss/App.scss';
import {
  closeMessage,
  getAllWargameMessages,
  openMessage,
  markAllAsRead,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import {LOCAL_STORAGE_TIMEOUT, expiredStorage} from "../consts";

import { umpireForceTemplate } from "../consts";

class Channel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allMarkedRead: false,
    };
  }

  componentWillMount() {
    if (this.props.playerUi.channels[this.props.channel].messages.length === 0) {
      this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
    }
  }

  markAllRead = () => {

    this.props.dispatch(markAllAsRead(this.props.channel));

    this.props.playerUi.channels[this.props.channel].messages.forEach((message) => {
      expiredStorage.setItem(`${this.props.playerUi.currentWargame}-${this.props.playerUi.selectedForce}-${this.props.playerUi.selectedRole}${message._id}`, "read", LOCAL_STORAGE_TIMEOUT);
    });
    this.setState({
      allMarkedRead: true,
    })
  };

  openMessage = (message) => {
    this.props.dispatch(openMessage(this.props.channel, message));
  };

  closeMessage = (message) => {
    this.props.dispatch(closeMessage(this.props.channel, message));
  };

  render() {

    let curChannel = this.props.channel;

    return (
      <>
        <div className="forces-in-channel">
          {this.props.playerUi.channels[curChannel].forceIcons.map((url, i) => <img key={`indicator${i}`} className="force-indicator role-icon" src={url} alt="" />)}
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
                allMarkedRead={this.state.allMarkedRead}
                userId={`${this.props.playerUi.currentWargame}-${this.props.playerUi.selectedForce}-${this.props.playerUi.selectedRole}`}
                open={this.openMessage}
                close={this.closeMessage}
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
