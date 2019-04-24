import React, { Component } from 'react';
import {connect} from "react-redux";
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {
  setSelectedChannel,
  setForceOverview
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import {
  getAllMessageTypes,
} from "../../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";

import '../../scss/App.scss';

import TabsSearchList from "../../Components/TabsSearchList";
import ChannelsTable from "../../Components/Layout/ChannelsTable";

class ForcesTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      channelList: this.props.wargame.tabs[this.props.wargame.currentTab].data.channels,
      searchQuery: '',
    }
  };


  componentWillReceiveProps(nextProps, nextContext) {

    const curPropsState = Object.keys(this.props.wargame.tabs[this.props.wargame.currentTab].data.channels);
    const nextPropsState = Object.keys(nextProps.wargame.tabs[nextProps.wargame.currentTab].data.channels);

    if (curPropsState.length !== nextPropsState.length) {
      this.setState({
        channelList: nextProps.wargame.tabs[nextProps.wargame.currentTab].data.channels
      });
    }
  }

  openModal = () => {
    this.props.dispatch(modalAction.open("addChannel"));
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

  createChannelEditor() {

    let curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.tabs[curTab].data.selectedChannel;

    return (
      <div className="flex-content--fill channelsTab">
        <h3>{selectedChannel}</h3>

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
          <span className="link link--noIcon" onClick={this.openModal}>Add channel</span>
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
