import React, { Component } from 'react';

class ProgressBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="progress">
        {this.props.children}
      </div>
    );
  }
}

export default ProgressBar;