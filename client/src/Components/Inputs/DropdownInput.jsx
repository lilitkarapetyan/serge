import React, { Component } from 'react';
import PropTypes from "prop-types";

import '../../scss/App.scss';

class DropdownInput extends Component {

  constructor(props) {
    super(props);
  }

  onChange = (e) => {
    this.props.updateStore(e.target.value);
  };

  render() {
    return (
      <select disabled={this.props.disabled} value={this.props.data ? this.props.data : "placeholder"} onChange={this.onChange}>
        <option value="placeholder">{this.props.placeholder}</option>
        { this.props.selectOptions.map((opt, i) => {
          return (<option key={`${opt}${i}`} value={opt}>{opt}</option>)
        })}
      </select>
    );
  }
}

DropdownInput.propTypes = {
  updateStore: PropTypes.func.isRequired,
  selectOptions: PropTypes.array.isRequired,
  // options: PropTypes.object.isRequired,
};


export default DropdownInput;
