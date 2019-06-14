import React, { Component } from 'react';
import { connect } from "react-redux";

import MessagesListChannel from "../Views/MessagesListChannel";
import MessagesListRenderProp from "../Views/MessagesListRenderProp";
import NewMessage from "./NewMessage";
import '../scss/App.scss';
import {getAllWargameMessages} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

class Channel extends Component {

  componentWillMount() {
    if (this.props.playerUi.channels[this.props.channel].messages.length === 0) {
      this.props.dispatch(getAllWargameMessages(this.props.playerUi.currentWargame));
    }
  }

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
          orderableChannel={true}
          curChannel={curChannel}
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
