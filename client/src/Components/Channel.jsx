import React, { Component } from 'react';
import { connect } from "react-redux";

import MessagesListChannel from "../Views/MessagesListChannel";
import MessagesListRenderProp from "../Views/MessagesListRenderProp";
import NewMessage from "./NewMessage";
import '../scss/App.scss';

class Channel extends Component {

  render() {

    let curChannel = this.props.channel;

    return (
      <>
        <div className="forces-in-channel">
          {this.props.playerUi.channels[curChannel].forceIcons.map((base64, i) => <img key={`indicator${i}`} className="force-indicator" src={base64} alt="" />)}
        </div>

        <MessagesListRenderProp
          curChannel={curChannel}
          messages={this.props.playerUi.channels[curChannel].messages}
          render={(messages, actions) => (
            <MessagesListChannel
              curChannel={curChannel}
              messages={messages}
              openSection={actions.openSection}
              closeSection={actions.closeSection}
            />
          )}
        />

        <NewMessage
          curChannel={curChannel}
          // schema={this.props.playerUi.messageSchema}
          templates={this.props.playerUi.channels[curChannel].templates}
        />
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(Channel);
