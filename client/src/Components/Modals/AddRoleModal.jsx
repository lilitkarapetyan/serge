import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {
  addRole,
  updateRole,
  setTabUnsaved,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class AddRoleModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      roleName: this.props.currentModal.data ? this.props.currentModal.data.name : '',
    };
  }

  hideModal = () => {

    this.setState({
      roleName: '',
    });

    this.props.dispatch(modalAction.close());
  };


  setNewRoleName = (e) => {
    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data.forces.selectedForce;
    this.setState({
      roleName: e.target.value,
      sameName: this.props.wargame.data[curTab].forces.find((force) => force.forceName === selectedForce).roles.some((role) => role.name === e.target.value)
    });
  };

  addRole = () => {
    let selectedForce = this.props.wargame.data.forces.selectedForce;

    let newRole = {
      name: this.state.roleName,
      control: this.props.currentModal.data ? this.props.currentModal.data.control : false,
    };

    this.props.dispatch(setTabUnsaved());

    if (this.props.currentModal.data) {
      this.props.dispatch(updateRole(selectedForce, this.props.currentModal.data.name, newRole));
    } else {
      this.props.dispatch(addRole(selectedForce, newRole));
    }
  };

  render() {

    if (!this.props.currentModal.open) return false;

    var disable = this.state.roleName.length < 1 || this.state.sameName;

    return (
      <ModalWrapper>
        <div className="display-text-wrapper">
          <h3>Add a role</h3>
          {this.state.sameName ? <p className="notification">Already exists</p> : false}
          <input autoFocus className="modal-input" type="text" onChange={this.setNewRoleName} value={this.state.roleName || ''} />
          <div className="buttons">
            <button disabled={disable} name="add" className="btn btn-action btn-action--primary" onClick={this.addRole}>Add</button>
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

export default connect(mapStateToProps)(AddRoleModal);
