// import React, { Component } from 'react';
// import '../scss/App.scss';
import MessageListItem from "../Components/MessageListItem";

class MessagesListChannel extends Component {

  render() {

    let messages = this.props.messages;

    return (

      messages.map((item, i) => {

        if (item.infoType) {
          return <p className="turn-marker" key={`${i}-turnmarker`}>Turn {item.gameTurn}</p>
        }

        return (
          <MessageListItem
            detail={item}
            key={`${i}-messageitem`}
            openSection={this.props.openSection}
            closeSection={this.props.closeSection}
          />
        );
      })
    );
  }
}

export default MessagesListChannel;
