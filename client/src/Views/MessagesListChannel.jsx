import React, { Component } from 'react';
import '../scss/App.scss';
import MessageListItem from "../Components/MessageListItem";

class MessagesListChannel extends Component {

  render() {

    let messages = this.props.messages;

    return (
      messages.map((item, i) => {

        if (item.message.infoType) {
          return <p className="turn-marker">Turn {item.message.gameTurn}</p>
        }

        return (
          <MessageListItem
            detail={item}
            key={`${i}-messageitem`}
            openSection={this.props.openSection.bind(this, item)}
            closeSection={this.props.closeSection.bind(this, item)}
          />
        );
      })
    );
  }
}

export default MessagesListChannel;
