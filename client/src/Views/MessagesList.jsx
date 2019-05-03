import React, { Component } from 'react';
import { connect } from "react-redux";

import Badge from "react-bootstrap/Badge";

import Collapsible from "react-collapsible";
import MessagePreview from "../Components/MessagePreviewPlayerUi";

import _ from "lodash";

import '../scss/App.scss';

class MessagesList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.messages.length !== 0 && nextProps.messages.length !== this.props.messages.length) {

      let newMessage = {
        message: nextProps.messages[0],
        open: false,
      };

      let messages = this.state.messages;
      messages.unshift(newMessage);

      this.setState({
        messages,
      });
    }

    if (
      (this.props.messages.length === 0) ||
      (this.props.curChannel !== nextProps.curChannel)
    ) {
      this.setState({
        messages: nextProps.messages.map((item) => ({ message: item, open: false })).filter((item) => item.message.details.channel === nextProps.curChannel)
      });
    }
  }

  openSection = (el) => {

    el.open = true;
    let index = this.state.messages.findIndex((item) => item.message._id === el.message._id);
    let messages = this.state.messages;

    messages.splice(index, 1, el);

    this.setState({
      messages
    });
  };

  closeSection = (el) => {

    el.open = false;
    let index = this.state.messages.findIndex((item) => item.message._id === el.message._id);
    let messages = this.state.messages;

    messages.splice(index, 1, el);

    this.setState({
      messages
    });
  };

  render() {

    return (
      <div className="message-list">
        {this.state.messages.map((item, i) => {
          return (
              <Collapsible
                key={`${i}-title`}
                trigger={<div className="wrap">{item.message.message.title} <Badge pill variant="secondary">{item.message.details.messageType}</Badge></div>}
                transitionTime={200}
                easing={'ease-in-out'}
                open={item.open}
                onOpening={this.openSection.bind(this, item)}
                onClosing={this.closeSection.bind(this, item)}
              >
                <div key={i} className="message-preview-player wrap"><MessagePreview detail={item.message.message} from={item.message.details.from.force} /></div>
              </Collapsible>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(MessagesList);
