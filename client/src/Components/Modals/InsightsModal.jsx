import React, { Component } from "react";
import { connect } from "react-redux";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalWrapper from "./ModalWrapper";
import TextArea from "../Inputs/TextArea";
import TextInput from "../Inputs/TextInput";
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import { sendFeedbackMessage } from "../../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import { PlayerStateContext } from "../../Store/PlayerUi";
import "../../scss/App.scss";

class InsightsModal extends Component {
  static contextType = PlayerStateContext;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      message: '',
    };

    this.send = this.send.bind(this);
  }

  hideModal = () => {
    this.props.dispatch(modalAction.close());
  };

  setName = (val) => {
    this.setState({
      name: val,
    })
  };

  setMessage = (val) => {
    this.setState({
      message: val,
    })
  };

  send = () => {
    const [ state ] = this.context;
    let forceName = state.allForces.find((force) => force.uniqid === state.selectedForce).name;

    let from = {
      force: forceName,
      forceColor: state.forceColor,
      role: state.selectedRole,
      name: this.state.name,
    };

    sendFeedbackMessage(state.currentWargame, from, this.state.message)(this.props.dispatch);
  };

  render() {

    if (!this.props.currentModal.open) return false;

    return (
      <ModalWrapper>
        <div className="display-text-wrapper lessons-modal">
          <div className="title">
            <FontAwesomeIcon icon={faCommentAlt} size="2x"/><h3>Insights</h3>
          </div>
          <p>Use this form to give private feedback on the game itself.</p>
          <p>Comments are only visible to the Game Controller. No other player has access to the comments you post here.</p>
          <div className="text-input-wrap">
            <TextArea
              id="message-input"
              className="material-input"
              label="Message"
              updateStore={this.setMessage}
              data={this.state.message}
            />
          </div>
          <div className="text-input-wrap">
            <TextInput
              id="name-input"
              className="material-input"
              label="Name: optional"
              updateStore={this.setName}
              options={{numInput: false}}
              data={this.state.name}
            />
          </div>
          <div className="buttons">
            <button name="cancel" className="btn btn-action btn-action--secondary" onClick={this.hideModal}>Cancel</button>
            <button name="continue" className="btn btn-action btn-action--primary" onClick={this.send}>Send</button>
          </div>
        </div>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = ({ currentModal }) => ({
  currentModal
});

export default connect(mapStateToProps)(InsightsModal);
