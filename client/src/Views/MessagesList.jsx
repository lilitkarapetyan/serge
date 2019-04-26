import React, { Component } from 'react';
import { connect } from "react-redux";

import MessagePreview from "../Components/MessagePreview";

import '../scss/App.scss';

class MessagesList extends Component {

  render() {
    let messages = this.props.messages.filter((item) => item.details.channel === this.props.curChannel);

    return (
      <>
        {messages.map((item, i) => {
          return (<div className="message-preview"><MessagePreview key={i} detail={item.message} /></div>);
        })}
      </>
    );
  }
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(MessagesList);
