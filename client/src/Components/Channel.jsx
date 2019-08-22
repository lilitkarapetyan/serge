import React, { Component } from "react";
import { umpireForceTemplate } from "../consts";
import MessageListItem from "../Components/MessageListItem";
import NewMessage from "./NewMessage";
import {
  closeMessage,
  getAllWargameMessages,
  openMessage,
  markAllAsRead,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import { PlayerStateContext } from "../Store/PlayerUi";
import "../scss/App.scss";

class Channel extends Component {
  static contextType = PlayerStateContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const [ state, dispatch ] = this.context;

    if (state.channels[this.props.channel].messages.length === 0) {
      getAllWargameMessages(state.currentWargame)(dispatch);
    }
  }

  markAllRead = () => {
    const [ , dispatch ] = this.context;
    dispatch(markAllAsRead(this.props.channel));
  };

  openMessage = (message) => {
    const [ , dispatch ] = this.context;
    dispatch(openMessage(this.props.channel, message));
  };

  closeMessage = (message) => {
    const [ , dispatch ] = this.context;
    dispatch(closeMessage(this.props.channel, message));
  };

  render() {

    // use this next lines of JSX, near "mark as read", to allow bulk insertion
    // <button name="Send 10 messages" className="btn btn-action btn-action--secondary" onClick={this.sendMultiple}>Send Multiple</button>
    // <span className="btn-helper">{this.props.playerUi.channels[curChannel].messages.length}</span>

    let curChannel = this.props.channel;
    const [ state ] = this.context;

    return (
      <>
        <div className="forces-in-channel">
          {state.channels[curChannel].forceIcons.map((url, i) => <img key={`indicator${i}`} className="force-indicator role-icon" src={url} alt="" />)}
          <button name="mark as read" className="btn btn-action btn-action--secondary" onClick={this.markAllRead}>Mark all read</button>
        </div>

        <div className="message-list">

          {state.channels[curChannel].messages.map((item, i) => {

            if (item.infoType) {
              return <p className="turn-marker" key={`${item.gameTurn}-turnmarker`}>Turn {item.gameTurn}</p>
            }
            return (
              <MessageListItem
                detail={item}
                key={`${item._id}-messageitem`}
                userId={`${state.currentWargame}-${state.selectedForce}-${state.selectedRole}`}
                open={this.openMessage}
                close={this.closeMessage}
              />
            );
          })}
        </div>
        {
          state.channels[curChannel].observing === false &&
          <NewMessage
            orderableChannel={true}
            curChannel={curChannel}
            privateMessage={state.selectedForce === umpireForceTemplate.uniqid}
            templates={state.channels[curChannel].templates}
          />
        }
      </>
    );
  }
}

export default Channel;
