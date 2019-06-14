import React, { Component } from 'react';
import { connect } from "react-redux";

import Link from "../Components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { createExportItem } from "../ActionsAndReducers/ExportItems/ExportItems_ActionsCreators";
import ExcelExport from '../Components/ExcelExport';

class ExportMessages extends Component {

  componentWillMount() {
    this.props.dispatch(getAllMessageTypes());
  }

  createExportItem = () => {
    const infoTypeMessages = this.props.wargame.exportMessagelist.filter(({infoType, data}) => (
      infoType && data && data.channels && Array.isArray(data.channels.channels)
    ));

    let channelTitles = {};

    for(const { data } of infoTypeMessages) {
      for(const { uniqid, name } of data.channels.channels) {
        if(channelTitles[uniqid]) continue;
        channelTitles[uniqid] = name;
      }
    }

    this.props.dispatch(createExportItem({
      title: `Export ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
      wargame: this.props.wargame.currentWargame ? this.props.wargame.wargameTitle : 'Not Selected',
      data: this.props.messageTypes.messages.map(messageType => ({
        type: messageType.title,
        details: messageType.details,
        messages: this.filterAndMapMessagesByType(messageType, this.props.wargame.exportMessagelist, channelTitles)
      }))
    }));
  }

  filterAndMapMessagesByType(type, messages, channelTitles) {
    //all excel keys/titles for current tab
    let fields = [];
    //rows under titles
    let rows = [];

    const messagesFiltered = messages.filter(msg => (msg.details && msg.details.messageType === type.title));

    //loop on filtered messages
    for(let msg of messagesFiltered) {
      //check message channel
      if(msg.details && msg.details.channel && channelTitles[msg.details.channel]) {
        msg.details.channel = channelTitles[msg.details.channel];
      }

      //get message object keys as array
      const keys = Object.keys(msg);
      //reate row with empty items equal to current fields length
      const row = Array(fields.length).fill("");

      //loop on message keys
      for(const key of keys) {
        //if message[key] is object then do loop for that object keys
        if(typeof msg[key] === 'object') {
          let nextLevelKeys = Object.keys(msg[key]);
          for(const key2 of nextLevelKeys) {
            if(typeof msg[key][key2] !== 'object') {
              //check if fields/titles have no current key then add
              if(!fields.includes(key2)) {
                fields.push(key2);
              }

              //check position for field then add value to rigth position in row
              row[fields.indexOf(key2)] = msg[key][key2];
            }
          }
        }
        else {
          //check if fields/titles have no current key then add
          if(!fields.includes(key)) {
            fields.push(key);
          }
          //check position for field then add value to rigth position in row
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

  render() {
    return (
      <div className="view-wrapper view-wrapper-gamesetup">
        <div id="sidebar">
          <Link onClickHandler={this.notSavedNotification} href="/client/umpireMenu" id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>
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
                    Message Types: {item.data.filter(item => item.messages.length > 1).map((item, key) => (<span key={key}>
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
const mapStateToProps = ({ wargame, messageTypes, exportItems }) => ({
  wargame, messageTypes, exportItems
});

export default connect(mapStateToProps)(ExportMessages);
