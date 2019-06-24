import React, { Component } from 'react';
import { connect } from "react-redux";

import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { createExportItem } from "../ActionsAndReducers/ExportItems/ExportItems_ActionsCreators";
import ExcelExport from '../Components/ExcelExport';
import ExportItem from '../Components/ExportItem';
import ExportView from "./ExportView";

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
        title: messageType.title,
        details: messageType.details,
        items: this.filterAndMapMessagesByType(messageType, this.props.wargame.exportMessagelist, channelTitles)
      })),
      type: 'messages'
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
      let row = Array(fields.length).fill("");

      //loop on message keys
      for(const key of keys) {
        //if message[key] is object then do loop for that object keys
        if(typeof msg[key] === 'object') {
          for(const key2 of Object.keys(msg[key])) {
            if(typeof msg[key][key2] === 'object') {
              for(const key3 of Object.keys(msg[key][key2])) {
                if(typeof msg[key][key2][key3] !== 'object') {
                  if(!fields.includes(key3)) {
                    fields.push(key3);
                  }
                  row[fields.indexOf(key3)] = msg[key][key2][key3];
                }
              }
            }
            else {
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
      <ExportView>
        <h2>Export messages</h2>
        <span className="link link--noIcon" onClick={this.createExportItem}>Create Export</span>
        <ul>
          {this.props.exportItems.map((item, key) => (
            <ExportItem item={item} key={key}>
              <ExcelExport exp={item} index={key}/>
            </ExportItem>
          ))}
        </ul>
      </ExportView>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ wargame, messageTypes, exportItems }) => ({
  wargame, messageTypes, exportItems: exportItems.filter(item => item.type === 'messages')
});

export default connect(mapStateToProps)(ExportMessages);
