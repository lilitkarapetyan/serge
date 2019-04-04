import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import {setSelectedSchema} from "../ActionsAndReducers/UmpireMenu/umpireMenu_ActionCreators";
import {getSingleMessage} from "../ActionsAndReducers/dbMessages/messages_ActionCreators";

import moment from "moment";
import _ from "lodash";

class SearchList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      createView: this.props.currentViewURI.split('/')[2],
      messageList: this.props.listData.messages, // for HOC
      searchQuery: this.props.listData.messages,
      searchInput: "",
    };
  }


  componentWillUpdate(nextProps, nextState, nextContext) {

    let sameMessagesQuantity = _.differenceBy(nextProps.listData.messages, this.state.messageList, (item) => item.details.title).length;

    if (
      nextProps.listData.messages.length !== this.state.messageList.length ||
      (sameMessagesQuantity !== 0 && this.state.searchInput.length === 0)
    ) {
      this.setState({
        messageList: nextProps.listData.messages
      });
    }

    if (
      this.state.searchInput.length > 0 &&
      sameMessagesQuantity !== 0
    ) {
      this.filterMessages();
    }
  }

  setSelectedSchemaId(item) {

    switch (this.state.createView) {
      case 'templates':
        this.props.dispatch(setSelectedSchema(item._id));
        break;

      case 'library':
        this.props.dispatch(setSelectedSchema(item.schema._id));
        this.props.dispatch(getSingleMessage(item._id));
        break;

      case 'create':
        this.props.dispatch(setSelectedSchema(item._id));
        break;
      //
      // case 'edit':
      //   this.props.dispatch(setSelectedSchema(id));
      //   break;

      default:
        console.log('error');
        break;
    }
  }

  filterMessages = (input) => {

    let value = input ? input.target.value : this.state.searchInput;

    let searchQuery = this.props.listData.messages.filter(function(mes) {
      return mes.details.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });

    this.setState({
      searchQuery,
      searchInput: input ? value.toLowerCase() : this.state.searchInput
    });
  };

  render() {

    var that = this;

    var searchPlaceholder = this.props.placeholder ? this.props.placeholder : `Search ${this.state.createView}`;

    var list = this.state.searchInput ? this.state.searchQuery : this.state.messageList;

    return (
      <div className="searchlist">
        <input type="text" className="searchlist--input" key="search-templates" placeholder={searchPlaceholder} onChange={ this.filterMessages } value={this.state.searchInput} />
        <div className="searchlist--list">
          { list.map(function(item) {

            // onClick handlers should not contain instantiating () to pass a specific value, .bind can be used here this is a simpler
            // ES5 way to pass properties to click handlers from arrays, another option is to build a sub-component but I don't like
            // how the data moves back and forth, it breaks Reacts initial idea of 1 way data flow.

            let active;
            switch (that.state.createView) {

              case "templates":
                active = item._id === that.props.umpireMenu.selectedSchemaID ? 'active' : null;
                break;

              case "create":
                active = item._id === that.props.umpireMenu.selectedSchemaID ? 'active' : null;
                break;

              case "library":
                active = item._id === that.props.listData.messagePreviewId ? 'active' : null;
                break;

              default:
                console.log("no match");
                break;
            }

            // rework reuse logic..
            let title = item.details.title;
            let date = moment(item.lastUpdated).format('DD/MM/YY');
            return <span href="#" onClick={that.setSelectedSchemaId.bind(that, item)} key={item._id} className={active}>{title} - {date}</span>
          })
          }
        </div>
      </div>
    );
  }
}

// empty mapStateToProps is here for react-redux to wire up the dispatch function to props so firing actions is possible.
const mapStateToProps = ({ currentViewURI, umpireMenu }) => ({
  currentViewURI,
  umpireMenu
});


export default connect(mapStateToProps)(SearchList);