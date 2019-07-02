import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import _ from "lodash";
import Badge from "react-bootstrap/Badge";

import {expiredStorage, LOCAL_STORAGE_TIMEOUT} from "../consts";
import {
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment";
import Collapsible from "react-collapsible";
import MessagePreview from "../Components/MessagePreviewPlayerUi";

class MessageListItem extends Component {

  open = () => {
    expiredStorage.setItem(this.props.userId + this.props.detail._id, "read", LOCAL_STORAGE_TIMEOUT);
    this.props.open(this.props.detail);
  };

  close = () => {
    this.props.close(this.props.detail);
  };

  render() {

    let itemTitle;
    if (this.props.detail.message.title) {
      itemTitle = this.props.detail.message.title;
    } else if(this.props.detail.message.content) {
      // yes, we have content (probably chat) use it
      itemTitle = this.props.detail.message.content;
    } else {
      // no content, just use message-type
      itemTitle = this.props.detail.details.messageType;
    }

    let hasBeenRead = expiredStorage.getItem(this.props.userId + this.props.detail._id) === "read";

    return (
      <React.Fragment key={this.props.key}>
        <Collapsible
          trigger={
            <div className="message-title-wrap" style={{borderColor: this.props.detail.details.from.forceColor}}>
              <FontAwesomeIcon icon={this.props.detail.isOpen ? faMinus : faPlus} size="1x" />
              <div className="message-title">{itemTitle}</div>
              <div className="info-wrap">
                <Badge pill variant="primary">{moment(this.props.detail.details.timestamp).format("HH:mm")}</Badge>
                <Badge pill variant="dark">{this.props.detail.details.from.force} \\ {this.props.detail.details.from.role}</Badge>
                <Badge pill variant="secondary">{this.props.detail.details.messageType}</Badge>
                {!hasBeenRead && <Badge pill variant="warning">Unread</Badge>}
              </div>
            </div>
          }
          transitionTime={200}
          easing={'ease-in-out'}
          open={this.props.detail.isOpen}
          onOpening={this.open}
          onClosing={this.close}
        >
          <div key={`${this.props.key}-preview`} className="message-preview-player wrap"
           style={{borderColor: this.props.detail.details.from.forceColor}}><MessagePreview detail={this.props.detail.message} from={this.props.detail.details.from} privateMessage={this.props.detail.details.privateMessage} /></div>
        </Collapsible>
      </React.Fragment>
    )
  }
}


export default connect()(MessageListItem);
