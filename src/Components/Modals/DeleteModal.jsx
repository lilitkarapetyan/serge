import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import { deleteMessage } from "../../ActionsAndReducers/dbMessages/messages_ActionCreators";

// import PlusIcon from "../../static/svgs/plusIcon";

class DeleteModal extends Component {

  constructor(props) {
    super(props);
  }

  hideModal = () => {
    this.props.dispatch(modalAction.close());
  };

  deleteMessage = () => {
    this.props.dispatch(deleteMessage(this.props.messages.messagePreviewId));
  };

  render() {

    if (!this.props.currentModal.open) return false; // needed ?

    return (
      <ModalWrapper>
        <div className="display-text-wrapper">
          <h3>Are you sure you want to delete this?</h3>
          <div className="buttons">
            <button name="delete" onClick={this.deleteMessage}>Delete</button>
            <button name="cancel" onClick={this.hideModal}>Cancel</button>
          </div>
        </div>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = ({ currentModal, messages }) => ({
  currentModal,
  messages
});

export default connect(mapStateToProps)(DeleteModal);