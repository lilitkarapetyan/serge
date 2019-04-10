import React, {Component} from 'react';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import AddForceModal from "./AddForceModal";
import DeleteModal from './DeleteModal';
// import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";

class ModalSwitch extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    var modal;
    console.log(this.props.currentModal);

    switch (this.props.currentModal.modal) {

      case "addForce":
        modal = <AddForceModal />;
        break;

      case "delete":
        modal = <DeleteModal />;
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
