import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {
  addRole,
  setTabUnsaved,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class AddRoleModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      roleName: '',
      control: false,
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
      control: this.state.control,
    };
    this.props.dispatch(setTabUnsaved());
    this.props.dispatch(addRole(selectedForce, newRole));
  };

  setControlType = (e) => {
    this.setState({
      control: e.target.checked
    })
  };

  render() {

    if (!this.props.currentModal.open) return false;

    var disable = this.state.roleName.length < 1 || this.state.sameName;

    return (
      <ModalWrapper>
        <div className="display-text-wrapper">
          <h3>Add a role</h3>
          {this.state.sameName ? <p className="notification">Already exists</p> : false}
          <input autoFocus className="modal-input" type="text" onChange={this.setNewRoleName} />
          <input id="check" type="checkbox" onChange={this.setControlType}/><label htmlFor="check">Has game control.</label>
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
