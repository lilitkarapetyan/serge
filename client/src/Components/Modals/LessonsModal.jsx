import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {faCommentAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {sendFeedbackMessage} from "../../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import TextArea from "../Inputs/TextArea";
import TextInput from "../Inputs/TextInput";

class LessonsModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      message: '',
    };
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
    let forceName = this.props.playerUi.allForces.find((force) => force.uniqid === this.props.playerUi.selectedForce).name;
    let playerInfo = {
      force: forceName,
      role: this.props.playerUi.selectedRole,
      name: this.state.name,
    };
    this.props.dispatch(sendFeedbackMessage(this.props.playerUi.currentWargame, playerInfo, this.state.message))
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
            <TextInput
              id="name-input"
              className="material-input"
              label="Name: optional"
              updateStore={this.setName}
              options={{numInput: false}}
              data={this.state.name}
            />
          </div>
          <div className="text-input-wrap">
            <TextArea
              id="message-input"
              className="material-input"
              label="Message"
              updateStore={this.setMessage}
              data={this.state.message}
            />
          </div>
          <div className="buttons">
            <button name="continue" className="btn btn-action btn-action--primary" onClick={this.send}>Send</button>
            <button name="cancel" className="btn btn-action btn-action--secondary" onClick={this.hideModal}>Cancel</button>
          </div>
        </div>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = ({ playerUi, currentModal }) => ({
  playerUi,
  currentModal
});

export default connect(mapStateToProps)(LessonsModal);
