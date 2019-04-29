import React, { Component } from 'react';
import { connect } from "react-redux";

import Collapsible from "react-collapsible";
import MessagePreview from "../Components/MessagePreviewPlayerUi";

import '../scss/App.scss';

class MessagesList extends Component {

  render() {
    let messages = this.props.messages.filter((item) => item.details.channel === this.props.curChannel);

    return (
      <>
        {messages.map((item, i) => {
          return (
            <Collapsible
              trigger={item.message.title}
              transitionTime={200}
              easing={'ease-in-out'}
              open={i===0}
            >
              <div className="message-preview-player"><MessagePreview key={i} detail={item.message} from={item.details.from.force} /></div>
            </Collapsible>
          );
        })}
      </>
    );
  }
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(MessagesList);
