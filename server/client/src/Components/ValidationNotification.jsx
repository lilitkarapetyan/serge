import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';

class ValidationNotification extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="invalid-notification"><p>{this.props.children}</p></div>
      </>
    );
  }
}

const mapStateToProps = ({}) => ({

});

export default connect(mapStateToProps)(ValidationNotification);
