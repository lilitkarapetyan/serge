import React, { Component } from 'react';
import '../scss/App.scss';

class MessagesListRenderProp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: this.props.messages.map((item) => ({ message: item, open: false, hasBeenRead: this.props.allMarkedRead })),
    };
  }


  componentWillReceiveProps(nextProps, nextContext) {

    if (!this.props.allMarkedRead && nextProps.allMarkedRead) {
      this.setState({
        messages: this.state.messages.map((message) => ({...message, hasBeenRead: true})),
      });
    }

    let nextMessagesInChannel = nextProps.messages.map((message) => ({ ...message, open: false, hasBeenRead: false }));

    if (
      this.props.messages.length !== 0 &&
      this.props.messages.length < nextMessagesInChannel.length
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
        messages: nextProps.messages.map((message) => ({ ...message, open: false, hasBeenRead: nextProps.allMarkedRead }))
      });
    }
  }

  openSection = (el) => {

    el.open = true;
    el.hasBeenRead = true;
    let index = this.state.messages.findIndex((message) => message._id === el._id);
    let messages = this.state.messages;

    messages.splice(index, 1, el);

    this.setState({
      messages
    });

  };

  closeSection = (el) => {

    el.open = false;
    let index = this.state.messages.findIndex((message) => message._id === el._id);
    let messages = this.state.messages;

    messages.splice(index, 1, el);

    this.setState({
      messages
    });
  };

  render() {

    let openSection = this.openSection;
    let closeSection = this.closeSection;

    return (
      <div className="message-list">
        {this.props.render(this.state.messages, {openSection, closeSection})}
      </div>
    );
  }
}

export default MessagesListRenderProp;
