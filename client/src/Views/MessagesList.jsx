import React, { Component } from 'react';
import { connect } from "react-redux";
import '../scss/App.scss';
import MessageListItem from "../Components/MessageListItem";

class MessagesList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
  }


  componentWillReceiveProps(nextProps, nextContext) {

    let nextMessagesInChannel = nextProps.messages.map((item) => ({ message: item, open: false })).filter((item) => item.message.details.channel === nextProps.curChannel);
    let messagesInChannel = this.props.messages.map((item) => ({ message: item, open: false })).filter((item) => item.message.details.channel === this.props.curChannel);

    if (
      this.props.messages.length !== 0 &&
      messagesInChannel.length !== nextMessagesInChannel.length &&
      this.props.curChannel === nextProps.curChannel
    ) {

      let newMessages = nextMessagesInChannel;

      let messages = this.state.messages;
      messages.unshift(newMessages[0]);

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
            <MessageListItem
              detail={item}
              curChannel={this.props.curChannel}
              key={`${i}-messageitem`}
              openSection={this.openSection.bind(this, item)}
              closeSection={this.closeSection.bind(this, item)}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(MessagesList);
