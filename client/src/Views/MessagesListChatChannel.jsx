import React, { Component } from 'react';
import Badge from "react-bootstrap/Badge";
import MessagePreview from "../Components/MessagePreviewPlayerUi";
import '../scss/App.scss';

class MessagesListChatChannel extends Component {

  render() {

    let messages = this.props.messages;

    return (
      messages.map((item, i) => {
        return (
          <div key={`${i}-preview`} className="message-preview-player wrap">
            <MessagePreview detail={item.message.message} from={item.message.details.from} />
            <Badge pill variant="primary">{item.message.details.from.role}</Badge>
          </div>
        );
      })
    );
  }
}

export default MessagesListChatChannel;
