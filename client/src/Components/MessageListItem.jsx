import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';

import Badge from "react-bootstrap/Badge";

import {
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import Collapsible from "react-collapsible";
import MessagePreview from "../Components/MessagePreviewPlayerUi";
class MessageListItem extends Component {

  render() {

    let itemTitle;
    if (this.props.detail.message.message.title) {
      itemTitle = this.props.detail.message.message.title;
    } else {
      itemTitle = this.props.detail.message.message.content;
    }

    return (
      <Collapsible
        key={this.props.key}
        trigger={
          <>
            <FontAwesomeIcon icon={this.props.detail.open ? faMinus : faPlus} size="1x" />
            <div className="message-title">{itemTitle}</div>
            <Badge pill variant="secondary">{this.props.detail.message.details.messageType}</Badge>
          </>
        }
        transitionTime={200}
        easing={'ease-in-out'}
        open={this.props.detail.open}
        onOpening={this.props.openSection}
        onClosing={this.props.closeSection}
      >
        <div key={`${this.props.key}-preview`} className="message-preview-player wrap"><MessagePreview detail={this.props.detail.message.message} from={this.props.detail.message.details.from} /></div>
      </Collapsible>
    )
  }
}


export default connect()(MessageListItem);
