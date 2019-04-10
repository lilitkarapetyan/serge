import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import { addNewForce } from "../../ActionsAndReducers/GameSetup/gameSetup_ActionCreators";

class DeleteModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      forceName: ''
    };
  }

  hideModal = () => {

    this.setState({
      forceName: '',
    });

    this.props.dispatch(modalAction.close());
  };


  setNewForceName = (e) => {
    this.setState({
      forceName: e.target.value,
    });
  };


  addForce = () => {
    this.props.dispatch(addNewForce(this.state.forceName));
  };

  render() {

    if (!this.props.currentModal.open) return false; // needed ?

    return (
      <ModalWrapper>
        <div className="display-text-wrapper">
          <h3>Create a new force</h3>
          <input type="text" onChange={this.setNewForceName} />

          <div className="buttons">
            <button name="delete" className="btn btn-action btn-action--primary" onClick={this.addForce}>Add</button>
            <button name="cancel" className="btn btn-action btn-action--secondary" onClick={this.hideModal}>Cancel</button>
          </div>
        </div>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = ({ gameSetup, currentModal }) => ({
  gameSetup,
  currentModal
});

export default connect(mapStateToProps)(DeleteModal);
