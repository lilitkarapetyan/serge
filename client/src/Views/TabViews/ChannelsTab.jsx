import React, { Component } from 'react';
import {connect} from "react-redux";
import {
  setSelectedChannel,
  deleteSelectedChannel,
  saveChannel,
  addNewChannel,
  setTabUnsaved,
  setTabSaved,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import {channelTemplate} from "../../api/consts";

import '../../scss/App.scss';

import TabsSearchList from "../../Components/TabsSearchList";
import TextInput from "../../Components/Inputs/TextInput";
import ChannelsTable from "../../Components/Layout/ChannelsTable";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import uniqid from "uniqid";
import _ from "lodash";
import checkUnique from "../../Helpers/checkUnique";
import {addNotification} from "../../ActionsAndReducers/Notification/Notification_ActionCreators";
import {modalAction} from "../../ActionsAndReducers/Modal/Modal_ActionCreators";

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

    const curTab = this.props.wargame.currentTab;

    if (this.props.wargame.data[curTab].dirty) {
      this.props.dispatch(modalAction.open("unsavedChannel", "create-new"));
    } else {
      let id = `channel-${uniqid.time()}`;
      this.props.dispatch(addNewChannel({name: id, uniqid: id}));
      this.props.dispatch(setSelectedChannel(id));

      let template = channelTemplate;
      template.name = id;
      template.uniqid = id;

      this.props.dispatch(saveChannel(this.props.wargame.currentWargame, id, template, id));
    }
  };

  setSelected = (channel) => {

    const curTab = this.props.wargame.currentTab;

    if (this.props.wargame.data[curTab].dirty) {
      this.props.dispatch(modalAction.open("unsavedChannel", channel));
    } else {
      this.props.dispatch(setTabSaved());
      this.props.dispatch(setSelectedChannel(channel));
    }
  };

  filterChannels = (input) => {

    let value = input.target.value;

    let list = this.props.wargame.data[this.props.wargame.currentTab].channels;

    this.setState({
      channelList: list.filter((item) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1),
      searchQuery: value
    });
  };

  deleteChannel = () => {
    let curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.data[curTab].selectedChannel;
    this.props.dispatch(deleteSelectedChannel(this.props.wargame.currentWargame, selectedChannel));
  };

  updateChannelName = (name) => {
    this.props.dispatch(setTabUnsaved());
    this.setState({
      newChannelName: name,
    })
  };

  checkUnique() {
    const curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.data[curTab].selectedChannel;

    let channelNames = this.props.wargame.data[curTab].channels.map((force) => force.name);
        channelNames = _.pull(channelNames, selectedChannel);

    if (!checkUnique(this.state.newChannelName, channelNames)) {
      this.props.dispatch(addNotification("Channel name is not unique.", "warning"));
      return false;
    }
    return true;
  }

  saveChannel = () => {
    const curTab = this.props.wargame.currentTab;
    let selectedChannel = this.props.wargame.data[curTab].selectedChannel;

    let newChannelData = this.props.wargame.data[curTab].channels.find((c) => c.name === selectedChannel);

    if (typeof this.state.newChannelName === 'string' && this.state.newChannelName.length > 0) {

      if (!this.checkUnique()) return;

      this.props.dispatch(setTabSaved());

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
          />
          <span className="link link--noIcon" onClick={this.saveChannel}>save channel</span>
          <span className="link link--secondary" onClick={this.deleteChannel}><FontAwesomeIcon icon={faTrash} />Delete</span>
        </div>
        <p className="heading--sml">Participants and messages</p>

        <ChannelsTable data={this.props.wargame.data[curTab].channels.find((f) => f.name === selectedChannel).participants} />
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
