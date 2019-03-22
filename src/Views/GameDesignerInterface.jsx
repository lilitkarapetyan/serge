import React, { Component } from 'react';

import Link from "../Components/Link";

import '../scss/App.scss';

export default class GameDesignerInterface extends Component {

  constructor(props) {
    super(props);
  }

  updateHistory = () => {

  };

  render() {
    return (
      <div id="umpire">
        <Link href="/umpireMenu/templates" onClick={this.updateHistory}>Message Templates..</Link>
        <Link href="/umpireMenu/library">Message Library..</Link>
      </div>
    );
  }
}