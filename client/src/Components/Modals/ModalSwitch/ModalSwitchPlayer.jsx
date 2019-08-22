import React, {Component} from "react";
import { connect } from "react-redux";
import InsightsModal from "../InsightsModal";
import "../../../scss/App.scss";

class ModalSwitchPlayer extends Component {
  render() {
    let modal;
    switch (this.props.currentModal.modal) {
      case "lessons":
        modal = <InsightsModal />;
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
}

const mapStateToProps = ({ currentModal }) => ({
  currentModal,
});

export default connect(mapStateToProps)(ModalSwitchPlayer);
