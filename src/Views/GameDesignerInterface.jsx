import React, { Component } from 'react';
import {connect} from "react-redux";

import Link from "../Components/Link";

import '../scss/App.scss';
// import SearchList from "../Components/SearchList";

import {
  populateWargameStore,
  createNewWargameDB,
} from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import WargameSearchList from "../Components/WargameSearchList";

class GameDesignerInterface extends Component {

  constructor(props) {
    super(props);
  }


  componentWillMount() {
    this.props.dispatch(populateWargameStore());
  }

  createWargame = () => {
    this.props.dispatch(createNewWargameDB());
  };

  render() {
    return (
      <div id="umpire" className="flex-content-wrapper">
        <div className="flex-content flex-content--big">
          <Link href="/umpireMenu/templates" class="link link--secondary link--large">Message Templates</Link>
          <Link href="/umpireMenu/library" class="link link--secondary link--large">Message Library</Link>
        </div>
        <div className="flex-content flex-content--big">
          <span>Games</span>
          <Link
            href="/gameSetup"
            class="link link--noIcon"
            onClickMethod={this.createWargame}
          >Create</Link>
          <WargameSearchList key="searchlist"
                             listData={this.props.wargame.wargameList}
          />
        </div>
      </div>
    );
  }
}

// empty mapStateToProps is here for react-redux to wire up the dispatch function to props so firing actions is possible.
const mapStateToProps = ({wargame}) => ({
  wargame
});


export default connect(mapStateToProps)(GameDesignerInterface);
