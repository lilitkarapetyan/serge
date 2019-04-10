import React, { Component } from 'react';

class Row extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="flex-content flex-content--row">
        {this.props.children}
      </div>
    )
  }
}

export default Row;
