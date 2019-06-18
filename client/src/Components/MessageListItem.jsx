import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';

import Badge from "react-bootstrap/Badge";

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
    this.props.openSection(this.props.detail);
    this.forceUpdate();
  };

  close = () => {
    this.props.closeSection(this.props.detail);
    this.forceUpdate();
  };

  render() {

    let itemTitle;
    if (this.props.detail.message.title) {
      itemTitle = this.props.detail.message.title;
    } else {
      itemTitle = this.props.detail.message.content;
    }

    return (
      <React.Fragment key={this.props.key}>
        <Collapsible
          trigger={
            <div className="message-title-wrap" style={{borderColor: this.props.detail.details.from.forceColor}}>
              <FontAwesomeIcon icon={this.props.detail.isOpen ? faMinus : faPlus} size="1x" />
              <div className="message-title">{itemTitle}</div>
              <div className="info-wrap">
                <span>{moment(this.props.detail.details.timestamp).format("HH:mm")}</span>
                <Badge pill variant="dark">{this.props.detail.details.from.role}</Badge>
                <Badge pill variant="secondary">{this.props.detail.details.messageType}</Badge>
                {!this.props.detail.hasBeenRead && <Badge pill variant="warning">Unread</Badge>}
              </div>
            </div>
          }
          transitionTime={200}
          easing={'ease-in-out'}
          open={this.props.detail.isOpen}
          onOpening={this.open}
          onClosing={this.close}
        >
          <div key={`${this.props.key}-preview`} className="message-preview-player wrap"><MessagePreview detail={this.props.detail.message} from={this.props.detail.details.from} /></div>
        </Collapsible>
      </React.Fragment>
    )
  }
}


export default connect()(MessageListItem);
