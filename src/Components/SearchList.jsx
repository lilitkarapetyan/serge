import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import {setOpenMessage} from "../ActionsAndReducers/UmpireMenu/umpireMenu_ActionCreators";
import {getSingleMessage} from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import moment from "moment";

class SearchList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      creatorType: this.props.creatorType || this.props.currentViewURI.split('/')[2],
    };
  }

  setOpenMessageId(id) {

    switch (this.state.creatorType) {
      case 'templates':
        this.props.dispatch(setOpenMessage(id));
        break;

      case 'library':
        // this.props.dispatch(setOpenMessage(id));
        this.props.dispatch(getSingleMessage(id));
        break;

      case 'create':
        this.props.dispatch(setOpenMessage(id));
        break;

      case 'edit':
        this.props.dispatch(setOpenMessage(id));
        break;

      default:
        console.log('error');
        break;
    }
  }

  render() {

    var that = this;

    var searchPlaceholder = this.props.creatorType ? `Search ${this.props.creatorType}` : this.props.placeholder;

    return (
      <div className="searchlist">
        <input type="text" className="searchlist--input" key="search-templates" placeholder={searchPlaceholder} onChange={ this.props.filterMessages } value={this.props.searchInput} />
        <div className="searchlist--list">
        { this.props.messageList.map(function(item) {
            // onClick handlers should not contain instantiating () to pass a specific value, .bind can be used here this is a simpler
            // ES5 way to pass properties to click handlers from arrays, another option is to build a sub-component but I don't like
            // how the data moves back and forth, it breaks Reacts initial idea of 1 way data flow.

            let active = item._id === that.props.messages.messagePreviewId ? 'active' : null;
            let title;
            if (that.state.creatorType === 'create') {
              title = item.details.title;
              return <span href="#" onClick={that.setOpenMessageId.bind(that, item._id)} key={item._id} className={active}>{title}</span>
            } else {
              title = item.details.Title;
              let date = moment(item.lastUpdated).format('DD/MM/YY');
              return <span href="#" onClick={that.setOpenMessageId.bind(that, item._id)} key={item._id} className={active}>{title} - {date}</span>
            }
          })
        }
        </div>
      </div>
    );
  }
}

// empty mapStateToProps is here for react-redux to wire up the dispatch function to props so firing actions is possible.
const mapStateToProps = ({ currentViewURI, messages }) => ({
  currentViewURI,
  messages
});


export default connect(mapStateToProps)(SearchList);