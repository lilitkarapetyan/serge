import React, { Component } from 'react';
import '../scss/App.scss';
import MessageListItem from "../Components/MessageListItem";

class MessagesListChannel extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    let messages = this.props.messages;

    return (
      messages.map((item, i) => {
        return (
          <MessageListItem
            detail={item}
            curChannel={this.props.curChannel}
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
