import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';

import Badge from "react-bootstrap/Badge";

import Collapsible from "react-collapsible";
import MessagePreview from "../Components/MessagePreviewPlayerUi";
class MessageListItem extends Component {

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.detail.open === nextProps.detail.open;
  }

  render() {

    return (
      <Collapsible
        key={this.props.key}
        trigger={<div className="wrap">{this.props.detail.message.message.title} <Badge pill variant="secondary">{this.props.detail.message.details.messageType}</Badge></div>}
        transitionTime={200}
        easing={'ease-in-out'}
        open={this.props.detail.open}
        onOpening={this.props.openSection}
        onClosing={this.props.closeSection}
      >
        <div key={`${this.props.key}-preview`} className="message-preview-player wrap"><MessagePreview detail={this.props.detail.message.message} from={this.props.detail.message.details.from.force} /></div>
      </Collapsible>
    )
  }
}


export default connect()(MessageListItem);
