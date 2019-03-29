import React, {Component} from 'react';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import DefaultModal from './DeleteModal';
// import EditModal from './EditModal';
// import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";

class ModalSwitch extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {


    // if (this.props.currentModal.data === undefined) return null;

    // const editModal = this.props.currentModal.data.editable;
    //
    // var modal;
    //
    // if (editModal) {
    //   modal = <EditModal />;
    // } else {
    //   modal = <DefaultModal />;
    // }

    return (
      <DefaultModal/>
    )
  }
};

const mapStateToProps = ({ currentModal }) => ({
  currentModal,
});

export default connect(mapStateToProps)(ModalSwitch);