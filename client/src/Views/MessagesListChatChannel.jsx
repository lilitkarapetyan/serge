import React, { Component } from 'react';
import { connect } from "react-redux";
import Badge from "react-bootstrap/Badge";
import MessagePreview from "../Components/MessagePreviewPlayerUi";
import '../scss/App.scss';
import moment from "moment";

class MessagesListChatChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      force: {},
    }
  }

  componentDidMount() {
    const { allForces, selectedForce } = this.props.playerUi || {};
      if( allForces && selectedForce ) {
          this.state.force = {
              ...this.state.force,
              ...allForces.find((force) => force.uniqid === selectedForce)
          };
      }
  }

  render() {
    const { name } = this.state.force;
    const { messages } = this.props;

    return (
      messages.map((item, i) => {
        const { details, message } = item.message;
        const listItemClass = name === details.from.force ? 'own-message' : '';
        return (
          <div key={`${i}-preview`} className={`message-preview-player wrap ${listItemClass}`}>
            <span className="message-bullet" style={{ backgroundColor: details.from.forceColor }}>&nbsp;</span>
            <MessagePreview detail={message} from={details.from} />
            <div className="info-wrap">
              <time dateTime={details.timestamp}>{moment(details.timestamp).format("HH:mm")}</time>
              <Badge pill variant="primary">{details.from.role}</Badge>
            </div>
          </div>
        );
      })
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
    playerUi,
});

export default connect(mapStateToProps)(MessagesListChatChannel);
