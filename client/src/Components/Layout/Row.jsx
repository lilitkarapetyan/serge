import React, { Component } from 'react';

class Row extends Component {

  render() {
    return (
      <div className="flex-content flex-content--row">
        {this.props.children}
      </div>
    )
  }
}

export default Row;
