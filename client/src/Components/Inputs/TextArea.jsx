import React, { Component } from 'react';
import PropTypes from "prop-types";

import '../../scss/App.scss';

class TextArea extends Component {

  constructor(props) {
    super(props);
  }

  onChange = (e) => {
    this.props.updateStore(e.target.value);
  };

  render() {
    return (
      <textarea value={this.props.data} onChange={this.onChange} style={{resize: "none"}}></textarea>
    );
  }
}

TextArea.propTypes = {
  updateStore: PropTypes.func.isRequired,
};


export default TextArea;
