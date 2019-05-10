import React, { Component } from 'react';
import {connect} from "react-redux";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {removeRole} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class RemovableGroupItem extends Component {

  removeRole = () => {
    this.props.dispatch(removeRole(this.props.children));
  };

  render() {
    return (
      <span className="group-item" key={this.props.children}>
        {this.props.children}
        <FontAwesomeIcon icon={faTimes} onClick={this.removeRole} />
      </span>
    )
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(RemovableGroupItem);
