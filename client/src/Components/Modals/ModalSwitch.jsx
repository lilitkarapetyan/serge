import React, {Component} from 'react';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import AddForceModal from "./AddForceModal";
import DeleteModal from './DeleteModal';
import DeleteWargameModal from "./DeleteWargameModal";

class ModalSwitch extends Component {

  render() {

    var modal;

    switch (this.props.currentModal.modal) {

      case "addForce":
        modal = <AddForceModal />;
        break;

      case "delete":
        modal = <DeleteModal />;
        break;

      case "deleteWargame":
        modal = <DeleteWargameModal />;
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
