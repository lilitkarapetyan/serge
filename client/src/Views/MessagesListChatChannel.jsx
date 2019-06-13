import React, { Component } from 'react';
import Badge from "react-bootstrap/Badge";
import MessagePreview from "../Components/MessagePreviewPlayerUi";
import '../scss/App.scss';
import moment from "moment";

class MessagesListChatChannel extends Component {

  render() {

    let messages = this.props.messages;

    return (
      messages.map((item, i) => {
        return (
          <div key={`${i}-preview`} className="message-preview-player wrap">
            <MessagePreview detail={item.message.message} from={item.message.details.from} />
            <div className="info-wrap">
              <span>{moment(item.message.details.timestamp).format("HH:mm")}</span>
              <Badge pill variant="primary">{item.message.details.from.role}</Badge>
            </div>
          </div>
        );
      })
    );
  }
}

export default MessagesListChatChannel;
