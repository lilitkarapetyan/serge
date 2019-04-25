import React, { Component } from 'react';
import { connect } from "react-redux";

import MessagePreview from "../Components/MessagePreview";

import '../scss/App.scss';

class MessagesList extends Component {

  constructor(props) {
    super(props);
  }



  render() {

    let messages = this.props.messages.filter((item) => item.details.channel === this.props.curChannel);

    console.log(this.props.messages);
    console.log(messages);

    return (
      <>
        {messages.map((item, i) => {
          return (<MessagePreview key={i} detail={item.message} />);
        })}
      </>
    );
  }
}

const mapStateToProps = ({  }) => ({

});

export default connect(mapStateToProps)(MessagesList);
