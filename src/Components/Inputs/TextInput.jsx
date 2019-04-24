import React, { Component } from 'react';
import PropTypes from "prop-types";
import { classNames } from "classnames";
import {Tooltip} from "react-materialize";

import '../../scss/App.scss';
import ValidationNotification from "../ValidationNotification";

class TextInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      type: this.props.options.numInput ? "number" : "text",
    };
  }

  onChange = (e) => {
    this.props.updateStore(e.target.value);
  };

  render() {

    let invalid = !this.props.validInput ? 'invalid-input' : '';

    if (!this.props.validInput) {
      var invalidNotification = <ValidationNotification>This name is not unique</ValidationNotification>;
    }

    return (
      <>
        <input className={invalid} id={this.props.id ? this.props.id : null} type={this.state.type} onChange={this.onChange} value={this.props.data ? this.props.data : ""} />
      </>
    );
  }
}

TextInput.propTypes = {
  updateStore: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
};


export default TextInput;
