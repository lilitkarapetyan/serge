import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {addNewForce, setSelectedForce} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class AddForceModal extends Component {

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
    console.log(e.target.value);
    this.setState({
      forceName: e.target.value,
      sameName: this.props.wargame.data[this.props.wargame.currentTab].forces.some((force) => force === e.target.value)
    });
  };

  addForce = () => {
    this.props.dispatch(addNewForce(this.state.forceName));
    this.props.dispatch(setSelectedForce(this.state.forceName));
  };

  render() {

    if (!this.props.currentModal.open) return false;

    var disable = this.state.forceName.length < 1 || this.state.sameName;

    return (
      <ModalWrapper>
        <div className="display-text-wrapper">
          <h3>Create force</h3>
          {this.state.sameName ? <p className="notification">Already exists</p> : false}
          <input autoFocus className="modal-input" type="text" onChange={this.setNewForceName} />
          <div className="buttons">
            <button disabled={disable} name="add" className="btn btn-action btn-action--primary" onClick={this.addForce}>Add</button>
            <button name="cancel" className="btn btn-action btn-action--secondary" onClick={this.hideModal}>Cancel</button>
          </div>
        </div>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = ({ wargame, currentModal }) => ({
  wargame,
  currentModal
});

export default connect(mapStateToProps)(AddForceModal);
