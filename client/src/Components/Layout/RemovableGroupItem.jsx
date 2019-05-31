import React, { Component } from 'react';
import {connect} from "react-redux";
import {
  faTimes,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {removeRole, setTabUnsaved} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import {modalAction} from "../../ActionsAndReducers/Modal/Modal_ActionCreators";

class RemovableGroupItem extends Component {

  constructor() {
    super();
    this.state = {
      hover: false,
    };
  }

  removeRole = () => {
    this.props.dispatch(setTabUnsaved());
    this.props.dispatch(removeRole(this.props.children));
  };

  editRole = () => {
    let role = {
      name: this.props.data.name,
      password: this.props.data.password,
      control: this.props.isControl,
    };

    this.props.dispatch(modalAction.open("newRole", role));
  };

  showEditBtn = () => {
     this.setState({
       hover: true,
     });
  };

  hideEditBtn = () => {
    this.setState({
      hover: false,
    });
  };

  render() {
    return (
      <span className="group-item" key={this.props.children} onMouseOver={this.showEditBtn} onMouseOut={this.hideEditBtn}>
        { this.props.children }
        <FontAwesomeIcon className="edit-icon" icon={faPencilAlt} onClick={this.editRole} />
        { !this.props.isControl ? <FontAwesomeIcon icon={faTimes} onClick={this.removeRole} /> : false }
      </span>
    )
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(RemovableGroupItem);
