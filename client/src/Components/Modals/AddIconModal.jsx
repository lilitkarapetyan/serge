import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import DropZone from "../Inputs/DropZone";
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";

class AddIconModal extends Component {

  hideModal = () => {
    this.props.dispatch(modalAction.close());
  };


  handleKeyDown = (e) => {
    if (e.key === 'Enter' && this.state.roleName.length > 0 && !this.state.sameName) this.addRole();
  };

  render() {


    if (!this.props.currentModal.open) return false;

    return (
      <ModalWrapper>
        <div className="display-text-wrapper">
          <h3>Add an icon</h3>
          <DropZone />
        </div>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = ({ currentModal }) => ({
  currentModal
});

export default connect(mapStateToProps)(AddIconModal);
