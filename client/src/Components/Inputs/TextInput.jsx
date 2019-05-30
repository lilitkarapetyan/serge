import React, { Component } from 'react';
import PropTypes from "prop-types";

import '../../scss/App.scss';

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
    return (
      <>
        { this.props.label && <label className="material-label" htmlFor={this.props.id}>{this.props.label}</label> }
        <input className={this.props.className || ""} id={this.props.id ? this.props.id : null} type={this.state.type} onChange={this.onChange} value={this.props.data ? this.props.data : ""} />
      </>
    );
  }
}

TextInput.propTypes = {
  updateStore: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
};


export default TextInput;
