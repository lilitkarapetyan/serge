import React, { Component } from 'react';
import Badge from "react-bootstrap/Badge";
import '../scss/App.scss';
import moment from "moment";
import classNames from "classnames"

class MessagesListChatChannel extends Component {

  render() {

    let messages = this.props.messages;

    return (
      <>
        <span className="link link--noIcon link--secondary" onClick={this.props.markAllAsRead}>Mark all as read</span>
        {messages.map((item, i) => {
          return (
            <div key={`preview-${i}`} className="message-preview-player wrap" style={{borderColor: item.details.from.forceColor}}>
              <div className={classNames({"bold": !item.hasBeenRead})}>
                {item.message.content}
              </div>
              <div className="info-wrap">
                <span>{moment(item.details.timestamp).format("YYYY-MMM-DD HH:mm")}</span>
                <Badge pill variant="secondary">{item.details.from.role}</Badge>
              </div>
            </div>
          );
        })}
      </>
    );
  }
}

export default MessagesListChatChannel;
