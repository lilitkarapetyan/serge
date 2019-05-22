import React, {Component} from 'react';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import AddRoleModal from "./AddRoleModal";
import DeleteModal from './DeleteModal';
import DeleteWargameModal from "./DeleteWargameModal";
import UnsavedForceModal from "./UnsavedForceModal";
import UnsavedChannelModal from "./UnsavedChannelModal";
import AddIconModal from "./AddIconModal";

class ModalSwitch extends Component {

  render() {

    var modal;

    switch (this.props.currentModal.modal) {

      case "delete":
        modal = <DeleteModal />;
        break;

      case "deleteWargame":
        modal = <DeleteWargameModal />;
        break;

      case "unsavedForce":
        modal = <UnsavedForceModal />;
        break;

      case "unsavedChannel":
        modal = <UnsavedChannelModal />;
        break;

      case "newRole":
        modal = <AddRoleModal />;
        break;

      case "addIcon":
        modal = <AddIconModal />;
        break;

      default:
        modal = false;
        break;
    }

    return (
      <>
        {modal}
      </>
    )
  }
};

const mapStateToProps = ({ currentModal }) => ({
  currentModal,
});

export default connect(mapStateToProps)(ModalSwitch);
