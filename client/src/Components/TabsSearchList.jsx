import React, { Component } from 'react';
import classNames from "classnames";
import '../scss/App.scss';
import {PropTypes} from "prop-types";

class TabsSearchList extends Component {

  setSelected = (item) => {
    this.props.setSelected(item);
  };

  render() {
    let that = this;
    return (
      <div className="list">
        {this.props.filter ?
          <input type="text" className="list-input" key="search-templates" placeholder={this.props.placeholder} onChange={ this.props.filter } value={this.props.searchQuery} />
          : false
        }
        <div className="list-list">
          {this.props.listData.map(function(item) {
              let active = item.name === that.props.selected ? 'active' : '';

              return (
                <span
                  href="#"
                  onClick={that.setSelected.bind(that, item)}
                  key={item.uniqid}
                  className={classNames({"list-title": true, active})}>{item.name}
                </span>
              )
            })
          }
        </div>
      </div>
    );
  }
}

TabsSearchList.propTypes = {
  listData: PropTypes.array.isRequired,
  filter: PropTypes.func,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default TabsSearchList;
