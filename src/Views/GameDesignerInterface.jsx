import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../scss/App.scss';

export default class GameDesignerInterface extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="umpire">
        <Link to="/umpireMenu/templates">Message Templates..</Link>
        <Link to="/umpireMenu/library">Message Library..</Link>
      </div>
    );
  }
}