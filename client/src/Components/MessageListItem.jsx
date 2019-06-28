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
    const { currentWargame, detail } = props;
    super(props);
    this.state = {
      collapsed: true,
      hasBeenRead: (() => {
        return !!MessageListItem.getStorageState(currentWargame + detail._id);
      })(),
    }
  }

  componentDidUpdate(nextProps, nextState, nextContext) {
    const { currentWargame, detail, allMarkedRead } = this.props;
    const markedAsReadStorageState = MessageListItem.getStorageState(currentWargame + nextProps.detail._id);
    const hasBeenReadLocally  = markedAsReadStorageState === "read";
    const hasNotBeenReadLocally = markedAsReadStorageState === null;
    const selfReadAction = detail._id === nextProps.detail._id;

    const allMarkedAsRead = !allMarkedRead && nextProps.allMarkedRead;
    const markedAsReadOnStorage = !this.state.hasBeenRead && selfReadAction && hasBeenReadLocally;
    const markedAsRead    = !selfReadAction && hasBeenReadLocally;
    const markedAsUnread  = !selfReadAction && hasNotBeenReadLocally;

    // react reuses the component with different data when the messages array updates.
    // perform check against component detail _id to see if it's a new message and set
    // hasBeenRead correctly.
    if ( allMarkedAsRead || markedAsReadOnStorage || markedAsRead ) {
      this.setState({
        hasBeenRead: true,
      })
    } else if ( markedAsUnread ) {
      this.setState({
        hasBeenRead: false,
      })
    }
  }

  static getStorageState(key) {
    return window.localStorage.getItem(key);
  }

  open = () => {
    const { detail, currentWargame } = this.props;
    this.props.open(detail);
    window.localStorage.setItem(currentWargame + detail._id, "read");
    this.setState({
      collapsed: false,
      hasBeenRead: true,
    });
  };

  close = () => {
    this.props.close(this.props.detail);
    this.setState({
      collapsed: true,
    });
  };

  render() {
    const { detail, key } = this.props;
    const { collapsed, hasBeenRead } = this.state;
    const expanded = !collapsed || detail.isOpen;
    let itemTitle;
    if (detail.message.title) {
      itemTitle = detail.message.title;
    } else if(detail.message.content) {
      // yes, we have content (probably chat) use it
      itemTitle = detail.message.content;
    } else {
      // no content, just use message-type
      itemTitle = detail.details.messageType;
    }

    return (
      <React.Fragment key={key}>
        <Collapsible
          trigger={
            <div className="message-title-wrap" style={{borderColor: detail.details.from.forceColor}}>
              <FontAwesomeIcon icon={ expanded ? faMinus : faPlus } size="1x" />
              <div className="message-title">{itemTitle}</div>
              <div className="info-wrap">
                <span className="info-body">{moment(detail.details.timestamp).format("HH:mm")}</span>
                <Badge pill variant="dark">{detail.details.from.role}</Badge>
                <Badge pill variant="secondary">{detail.details.messageType}</Badge>
                {!hasBeenRead && <Badge pill variant="warning">Unread</Badge>}
              </div>
            </div>
          }
          transitionTime={200}
          easing={'ease-in-out'}
          open={expanded}
          onOpening={this.open}
          onClosing={this.close}
        >
          <div key={`${key}-preview`} className="message-preview-player wrap"
           style={{borderColor: detail.details.from.forceColor}}><MessagePreview detail={detail.message} from={this.props.detail.details.from} privateMessage={this.props.detail.details.privateMessage} /></div>
        </Collapsible>
      </React.Fragment>
    )
  }
}


export default connect()(MessageListItem);
