import React, { Component } from 'react';
import {connect} from 'react-redux';

import { setCurrentViewFromURI } from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_ActionCreators"

import '../scss/App.scss';

class Link extends Component {

  onClickHandler = (e) => {

    if (this.props.onClickMethod) this.props.onClickMethod();

    const aNewTab = e.metaKey || e.ctrlKey;
    const anExternalLink = this.props.href.startsWith('http');

    if (!aNewTab && !anExternalLink) {
      e.preventDefault();
      // history.push(props.href);
      window.history.pushState({}, '', this.props.href);
      this.props.dispatch(setCurrentViewFromURI(this.props.href));
    }
  };

  render() {
    return (
      <a href={this.props.href} onClick={this.onClickHandler} id={this.props.id ? this.props.id : null} className={this.props.class ? this.props.class : null}>
        {this.props.children}
      </a>
    );
  }
}


export default connect()(Link);