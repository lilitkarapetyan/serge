import React, { Component } from 'react';
import classNames from "classnames";
import '../scss/App.scss';
import {PropTypes} from "prop-types";

class TabsSearchList extends Component {

  setSelected = (item) => {
    this.props.setSelected(item);
  };

  createList() {
    var data = this.props.listData;

    var list = [];
    for (var prop in data) {
      let active = prop === this.props.selected ? 'active' : '';
      list.unshift(<span href="#" onClick={this.setSelected.bind(this, prop)} key={prop} className={classNames({"list-title": true, active})}>{prop}</span>);
    }
    return list;
  }

  render() {
    return (
      <div className="list">
        {this.props.filter ?
          <input type="text" className="list-input" key="search-templates" placeholder={this.props.placeholder} onChange={ this.props.filter } value={this.props.searchQuery} />
          : false
        }
        <div className="list-list">
          { this.createList() }
        </div>
      </div>
    );
  }
}

TabsSearchList.propTypes = {
  listData: PropTypes.object.isRequired,
  filter: PropTypes.func,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default TabsSearchList;
