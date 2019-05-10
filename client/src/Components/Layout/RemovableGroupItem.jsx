import React, { Component } from 'react';
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class RemovableGroupItem extends Component {

  render() {
    return (
      <span className="group-item" key={this.props.children}>
        {this.props.children}
        <FontAwesomeIcon icon={faTimes} />
      </span>
    )
  }
}

export default RemovableGroupItem;
