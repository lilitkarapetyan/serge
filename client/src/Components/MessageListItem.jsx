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

  constructor(props) {
    super(props);
    this.state = {
      hasBeenRead: !!window.localStorage.getItem(this.props.currentWargame + this.props.detail._id),
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {

    if (!this.props.allMarkedRead && nextProps.allMarkedRead) {
      this.setState({
        hasBeenRead: true,
      });
    }
    // react reuses the component with different data when the messages array updates.
    // perform check against component detail _id to see if it's a new message and set
    // hasBeenRead correctly.
    if (
      !this.state.hasBeenRead &&
      this.props.detail._id === nextProps.detail._id &&
      window.localStorage.getItem(this.props.currentWargame + nextProps.detail._id) === "read"
    ) {
      this.setState({
        hasBeenRead: true,
      })
    }

    if (
      this.props.detail._id !== nextProps.detail._id &&
      window.localStorage.getItem(this.props.currentWargame + nextProps.detail._id) === "read"
    ) {
      this.setState({
        hasBeenRead: true,
      })
    }
    if (
      this.props.detail._id !== nextProps.detail._id &&
      window.localStorage.getItem(this.props.currentWargame + nextProps.detail._id) === null
    ) {
      this.setState({
        hasBeenRead: false,
      })
    }
  }

  open = () => {
    this.props.open(this.props.detail);
    window.localStorage.setItem(this.props.currentWargame + this.props.detail._id, "read");
    this.setState({
      hasBeenRead: true,
    });
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

    return (
      <React.Fragment key={this.props.key}>
        <Collapsible
          trigger={
            <div className="message-title-wrap" style={{borderColor: this.props.detail.details.from.forceColor}}>
              <FontAwesomeIcon icon={this.props.detail.isOpen ? faMinus : faPlus} size="1x" />
              <div className="message-title">{itemTitle}</div>
              <div className="info-wrap">
                <span className="info-body">{moment(this.props.detail.details.timestamp).format("HH:mm")}</span>
                <Badge pill variant="dark">{this.props.detail.details.from.role}</Badge>
                <Badge pill variant="secondary">{this.props.detail.details.messageType}</Badge>
                {!this.state.hasBeenRead && <Badge pill variant="warning">Unread</Badge>}
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
