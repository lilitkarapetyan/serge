import React, { Component } from 'react';

import Link from "../Components/Link";

import '../scss/App.scss';
// import SearchList from "../Components/SearchList";

export default class GameDesignerInterface extends Component {

  // constructor(props) {
  //   super(props);
  // }

  updateHistory = () => {

  };

  render() {
    return (
      <div id="umpire" className="flex-content-wrapper">
        <div className="flex-content flex-content--big">
          <Link href="/umpireMenu/templates" onClick={this.updateHistory} class="link link--secondary link--large">Message Templates</Link>
          <Link href="/umpireMenu/library" class="link link--secondary link--large">Message Library</Link>
        </div>
        <div className="flex-content flex-content--big">
          <span>Games</span>
          <Link href="#" class="link link--noIcon">Create</Link>
          {/*<SearchList creatorType={ this.state.creatorType }*/}
                      {/*messageList={ this.state.messageList }*/}
                      {/*filterMessages={ this.filterMessages }*/}
                      {/*searchInput={ this.state.searchInput }*/}
          {/*/>*/}
        </div>
      </div>
    );
  }
}