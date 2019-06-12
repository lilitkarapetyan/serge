import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  getAllWargameFeedback,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import '../scss/App.scss';

class InsightsChannel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: Object.keys(this.props.playerUi.channels)[0],
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let channelLength = Object.keys(this.props.playerUi.channels).length;
    let nextChannelLength = Object.keys(nextProps.playerUi.channels).length;

    if (channelLength !== nextChannelLength) this.forceUpdate();

  }

  componentWillMount() {
    this.props.dispatch(getAllWargameFeedback(this.props.playerUi.currentWargame));
  }

  render() {

    return (
      <div className="message-list">
        {this.props.playerUi.feedbackMessages.map((message, i) => {
          return (
            <React.Fragment key={`feedback${i}`}>
              <h6>{message.playerInfo.force}</h6>
              <p>{message.playerInfo.role}</p>
              {message.playerInfo.name && <p>{message.playerInfo.name}</p>}
              <p>{message.message}</p>
            </React.Fragment>
          )
        })
        }
      </div>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(InsightsChannel);
