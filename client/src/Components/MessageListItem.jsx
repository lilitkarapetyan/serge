import React, { Component } from 'react';
import {connect} from 'react-redux';
import '../scss/App.scss';
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

  constructor(props) {
    super(props);
    this.state = {
      hasBeenRead: !!expiredStorage.getItem(this.props.userId + this.props.detail._id),
      collapsed: true,
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
      expiredStorage.getItem(this.props.userId + nextProps.detail._id) === "read"
    ) {
      this.setState({
        hasBeenRead: true,
      })
    }

    if (
      this.props.detail._id !== nextProps.detail._id &&
      expiredStorage.getItem(this.props.userId + nextProps.detail._id) === "read"
    ) {
      this.setState({
        hasBeenRead: true,
      });
      this.forceUpdate();
    }
    if (
      this.props.detail._id !== nextProps.detail._id &&
      expiredStorage.getItem(this.props.userId + nextProps.detail._id) === null
    ) {
      this.setState({
        hasBeenRead: false,
      });
      this.forceUpdate();
    }
  }

  open = () => {
    this.props.open(this.props.detail);
    expiredStorage.setItem(this.props.userId + this.props.detail._id, "read", LOCAL_STORAGE_TIMEOUT);
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

    let itemTitle;
    const { detail } = this.props;
    const { details, message, isOpen } = detail || {};
    const { collapsed, hasBeenRead } = this.state;
    const expanded = !collapsed || isOpen;
    const dynamicBorderColor = `${details.from.forceColor}${hasBeenRead ? 'B3':''}`;
    if (message.title) {
      itemTitle = message.title;
    } else if(message.content) {
      // yes, we have content (probably chat) use it
      itemTitle = message.content;
    } else {
      // no content, just use message-type
      itemTitle = details.messageType;
    }

    return (
      <React.Fragment key={this.props.key}>
        <Collapsible
          trigger={
            <div className="message-title-wrap" style={{borderColor: dynamicBorderColor}}>
              <FontAwesomeIcon icon={expanded ? faMinus : faPlus} size="1x" />
              <div className="message-title">{itemTitle}</div>
              <div className="info-wrap">
                <span className="info-body">{moment(details.timestamp).format("HH:mm")}</span>
                <Badge pill variant="dark">{details.from.role}</Badge>
                <Badge pill variant="secondary">{details.messageType}</Badge>
                {!hasBeenRead && <Badge pill variant="warning">Unread</Badge>}
              </div>
            </div>
          }
          transitionTime={200}
          easing={'ease-in-out'}
          open={expanded}
          onOpening={this.open}
          onClosing={this.close}
          className={ !hasBeenRead ? 'message-item-unread' : '' }
        >
          <div key={`${this.props.key}-preview`} className="message-preview-player wrap"
           style={{borderColor: dynamicBorderColor}}><MessagePreview detail={message} from={details.from} privateMessage={details.privateMessage} /></div>
        </Collapsible>
      </React.Fragment>
    )
  }
}


export default connect()(MessageListItem);
