import React, { Component } from 'react';
import { connect } from "react-redux";

import Link from "../Components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { getAllMessages } from "../ActionsAndReducers/dbMessages/messages_ActionCreators";
import { createExportItem } from "../ActionsAndReducers/ExportItems/ExportItems_ActionsCreators";
import ExcelExport from '../Components/ExcelExport';

class GameSetup extends Component {

  constructor(props) {
    super(props);

    this.createExportItem = this.createExportItem.bind(this);
    this.filterAndMapMessagesByType = this.filterAndMapMessagesByType.bind(this);

    this.state = {

    };
  }

  componentWillMount() {
    this.props.dispatch(getAllMessageTypes());
    this.props.dispatch(getAllMessages());
  }

  createExportItem() {
    let additionalTypes = [];
    let additionalMessages = [];

    if(this.props.wargame.currentWargame) {
      additionalTypes = [
        {title: "infoType"},
        {title: "Game", wargame: this.props.wargame.currentWargame},
      ]

      additionalMessages = this.props.wargame.exportMessagelist;
    }

    const messageTypes = [
      ...additionalTypes,
      ...this.props.messageTypes.messages
    ]

    this.props.dispatch(createExportItem({
      title: `Export ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
      wargame: this.props.wargame.currentWargame ? this.props.wargame.wargameTitle : 'Not Selected',
      data: messageTypes.map(messageType => ({
        type: messageType.title,
        details: messageType.details,
        messages: this.filterAndMapMessagesByType(messageType, [
          ...this.props.messages.messages,
          ...additionalMessages
        ])
      }))
    }));
  }

  filterAndMapMessagesByType(type, messages) {
    let fields = [];
    let rows = [];

    const messagesFiltered = messages.filter(msg => {
      if(msg.schema) {
        return msg.schema.title === type.title;
      }
      else {
        switch (type.title) {
          case "infoType":
            return msg.infoType;
          case "Game":
            return !msg.infoType;
          default:
            return false;
        }
      }
    });

    for(let msgK = 0; msgK < messagesFiltered.length; msgK++) {
      const msg = messagesFiltered[msgK];
      const keys = Object.keys(msg);
      const row = Array(fields.length).fill("");

      for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if(typeof msg[key] === 'object') {
          let nextLevelKeys = Object.keys(msg[key]);
          for(let j = 0; j < nextLevelKeys.length; j++) {
            const key2 = nextLevelKeys[j];
            if(typeof msg[key][key2] !== 'object') {
              if(!fields.includes(key2)) {
                fields.push(key2);
              }

              row[fields.indexOf(key2)] = msg[key][key2];
            }
          }
        }
        else {
          if(!fields.includes(key)) {
            fields.push(key);
          }
          row[fields.indexOf(key)] = msg[key];
        }
      }

      rows.push(row);
    }
    return [
      fields.map(field => (field.toUpperCase())),
      ...rows
    ];
  }

  checkAllSaved() {
    return true;
  }

  render() {
    return (
      <div className="view-wrapper view-wrapper-gamesetup">
        <div id="sidebar">
          <Link
            disable={!this.checkAllSaved()}
            class={classNames({"link--disabled": !this.checkAllSaved()})}
            onClickHandler={this.notSavedNotification} href="/client/umpireMenu" id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>
        </div>
        <div className="export-container">
          <h2>Export messages</h2>
          <span className="link link--noIcon" onClick={this.createExportItem}>Create Export</span>
          <ul>
            {this.props.exportItems.map((item, key) => (
              <li key={key} className="flex-content-wrapper">
                <div className="flex-content flex-content--big flex-content--first">
                  <h5>{item.title}</h5>
                  <p>Selected wargame: {item.wargame}</p>
                  <p>
                    Message Types: {item.data.map((item, key) => (<span key={key}>
                      {item.type} ({item.messages.length-1})
                    </span>))}
                  </p>
                </div>
                <div className="flex-content flex-content--big flex-content--last">
                  <ExcelExport exp={item} index={key}/>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ wargame, messages, messageTypes, exportItems }) => ({
  wargame, messages, messageTypes, exportItems
});

export default connect(mapStateToProps)(GameSetup);
