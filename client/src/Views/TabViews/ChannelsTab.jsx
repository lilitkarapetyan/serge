import React, { Component } from 'react';
import {connect} from "react-redux";
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {
  setSelectedChannel,
  setForceOverview,
  deleteSelectedChannel,
  updateChannelName,
  saveChannel, addNewChannel,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import '../../scss/App.scss';

import TabsSearchList from "../../Components/TabsSearchList";
import TextInput from "../../Components/Inputs/TextInput";
import ChannelsTable from "../../Components/Layout/ChannelsTable";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import uniqid from "uniqid";
import classNames from "classnames";

class ForcesTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      channelList: this.props.wargame.tabs[this.props.wargame.currentTab].data.channels,
      searchQuery: '',
      newChannelName: null,
    }
  };


  componentWillReceiveProps(nextProps, nextContext) {

    const curSelected = this.props.wargame.tabs[this.props.wargame.currentTab].data.selectedChannel;
    const nextSelected = nextProps.wargame.tabs[nextProps.wargame.currentTab].data.selectedChannel;
    const curPropsState = Object.keys(this.props.wargame.tabs[this.props.wargame.currentTab].data.channels);
    const nextPropsState = Object.keys(nextProps.wargame.tabs[nextProps.wargame.currentTab].data.channels);

    if (curPropsState.length !== nextPropsState.length || curSelected !== nextSelected) {
      this.setState({
        channelList: nextProps.wargame.tabs[nextProps.wargame.currentTab].data.channels
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
  };

  setSelected = (force) => {
    this.props.dispatch(setSelectedChannel(force));
  };

  updateOverview = (overview) => {
    this.props.dispatch(setForceOverview(overview));
  };

  filterChannels = (input) => {

    let value = input.target.value;

    let list = this.props.wargame.tabs[this.props.wargame.currentTab].data.channels;

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
    let selectedChannel = this.props.wargame.tabs[curTab].data.selectedChannel;
    this.props.dispatch(deleteSelectedChannel(selectedChannel));
  };

  updateChannelName = (name) => {
    this.setState({
      newChannelName: name,
    })
  };

  saveChannel = () => {
    const curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.tabs[curTab].data.selectedChannel;

    let newChannelData = this.props.wargame.tabs[curTab].data.channels[selectedChannel];

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
    let selectedChannel = this.props.wargame.tabs[curTab].data.selectedChannel;

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
          <span className="link link--noIcon" onClick={this.saveChannel}>save</span>
          <span className="link link--secondary" onClick={this.deleteChannel}><FontAwesomeIcon icon={faTrash} />Delete</span>
        </div>
        <p className="heading--sml">Participants and messages</p>

        <ChannelsTable data={this.props.wargame.tabs[curTab].data.channels[selectedChannel]} />
      </div>
    );
  }

  render() {

    const curTab = this.props.wargame.currentTab;
    const selectedChannel = this.props.wargame.tabs[curTab].data.selectedChannel;

    return (
      <div className="flex-content-wrapper">
        <div className="flex-content">
          <span className="link link--noIcon" onClick={this.createChannel}>Add channel</span>
          <TabsSearchList listData={this.state.channelList}
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
