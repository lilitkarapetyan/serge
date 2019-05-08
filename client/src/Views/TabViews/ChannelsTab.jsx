import React, { Component } from 'react';
import {connect} from "react-redux";
import {
  setSelectedChannel,
  setForceOverview,
  deleteSelectedChannel,
  // updateChannelName,
  saveChannel,
  addNewChannel,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import {channelTemplate} from "../../api/consts";

import '../../scss/App.scss';

import TabsSearchList from "../../Components/TabsSearchList";
import TextInput from "../../Components/Inputs/TextInput";
import ChannelsTable from "../../Components/Layout/ChannelsTable";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import uniqid from "uniqid";

class ForcesTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      channelList: this.props.wargame.data[this.props.wargame.currentTab].channels,
      searchQuery: '',
      newChannelName: null,
    }
  };


  componentWillReceiveProps(nextProps, nextContext) {

    const curSelected = this.props.wargame.data[this.props.wargame.currentTab].selectedChannel;
    const nextSelected = nextProps.wargame.data[nextProps.wargame.currentTab].selectedChannel;
    const curPropsState = this.props.wargame.data[this.props.wargame.currentTab].channels;
    const nextPropsState = nextProps.wargame.data[nextProps.wargame.currentTab].channels;

    if (curPropsState.length !== nextPropsState.length || curSelected !== nextSelected) {
      this.setState({
        channelList: nextProps.wargame.data[nextProps.wargame.currentTab].channels
      });
    }

    if (curSelected !== nextSelected) {
      this.setState({
        newChannelName: null,
      });
    }
  }

  createChannel = () => {
    let name = 'channel-' + uniqid.time();
    this.props.dispatch(addNewChannel(name));
    this.props.dispatch(setSelectedChannel(name));

    let template = channelTemplate;
    template.channelName = name;

    this.props.dispatch(saveChannel(this.props.wargame.currentWargame, name, template, name));
  };

  setSelected = (channel) => {
    this.props.dispatch(setSelectedChannel(channel));
  };

  filterChannels = (input) => {

    let value = input.target.value;

    let list = this.props.wargame.data[this.props.wargame.currentTab].channels;

    let newState = {};
    for (let prop in list) {
      if (prop.toLowerCase().indexOf(value.toLowerCase()) > -1) newState[prop] = list[prop];
    }

    this.setState({
      channelList: newState,
      searchQuery: value
    });
  };

  deleteChannel = () => {
    let curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.data[curTab].selectedChannel;
    this.props.dispatch(deleteSelectedChannel(this.props.wargame.currentWargame, selectedChannel));
  };

  updateChannelName = (name) => {
    this.setState({
      newChannelName: name,
    })
  };

  saveChannel = () => {
    const curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.data[curTab].selectedChannel;

    let newChannelData = this.props.wargame.data[curTab].channels.find((c) => c.channelName === selectedChannel);

    console.log(newChannelData);

    if (typeof this.state.newChannelName === 'string' && this.state.newChannelName.length > 0) {
      this.props.dispatch(saveChannel(this.props.wargame.currentWargame, this.state.newChannelName, newChannelData, selectedChannel));
    }

    if (this.state.newChannelName === null) {
      this.props.dispatch(saveChannel(this.props.wargame.currentWargame, selectedChannel, newChannelData, selectedChannel));
    } else if (this.state.newChannelName.length === 0) {
      alert('no channel name');
    }
  };


  createChannelEditor() {

    let curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.data[curTab].selectedChannel;

    let channelName = typeof this.state.newChannelName === 'string' ? this.state.newChannelName : selectedChannel;

    return (
      <div className="flex-content--fill channelsTab">
        <div className="flex-content--row">
          <TextInput
            id="channel-editable"
            updateStore={this.updateChannelName}
            options={{numInput: false}}
            data={channelName}
            validInput={this.props.wargame.validation.validChannelName}
          />
          <span className="link link--noIcon" onClick={this.saveChannel}>save channel</span>
          <span className="link link--secondary" onClick={this.deleteChannel}><FontAwesomeIcon icon={faTrash} />Delete</span>
        </div>
        <p className="heading--sml">Participants and messages</p>

        <ChannelsTable data={this.props.wargame.data[curTab].channels.find((f) => f.channelName === selectedChannel).participants} />
      </div>
    );
  }

  render() {

    const curTab = this.props.wargame.currentTab;
    const selectedChannel = this.props.wargame.data[curTab].selectedChannel;

    return (
      <div className="flex-content-wrapper">
        <div className="flex-content">
          <span className="link link--noIcon" onClick={this.createChannel}>Add channel</span>
          <TabsSearchList listData={this.state.channelList.map((channel) => channel.channelName)}
                          filter={this.filterChannels}
                          searchQuery={this.state.searchQuery}
                          setSelected={this.setSelected}
                          selected={selectedChannel}
                          placeholder={"Search channels"}
          />
        </div>

        {selectedChannel ?
          this.createChannelEditor()
        : null}

      </div>
    );
  }
}

// temp use allMessages
const mapStateToProps = ({ messages, wargame }) => ({
  messages,
  wargame,
});

export default connect(mapStateToProps)(ForcesTab);
