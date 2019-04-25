import React, { Component } from 'react';
import {connect} from "react-redux";
import TabsSearchList from "../../Components/TabsSearchList";
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {
  setSelectedForce,
  setForceOverview
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import '../../scss/App.scss';
import TextArea from "../../Components/Inputs/TextArea";
import RemovableGroupItem from "../../Components/Layout/RemovableGroupItem";

class ForcesTab extends Component {

  constructor(props) {
    super(props);
  };

  openModal = () => {
    this.props.dispatch(modalAction.open("addForce"));
  };

  setSelected = (force) => {
    this.props.dispatch(setSelectedForce(force));
  };

  updateOverview = (overview) => {
    this.props.dispatch(setForceOverview(overview));
  };

  createForceEditor() {

    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.tabs[curTab].data.selectedForce;

    return (
      <div className="flex-content--fill forcesTab">

        <h3>{selectedForce}</h3>

        <span className="link link--secondary link--noIcon link--disabled">Change icon</span>

        <p className="heading--sml">Overview &amp; Objectives</p>
        <TextArea
          updateStore={this.updateOverview}
          data={this.props.wargame.tabs[curTab].data.forces[selectedForce].overview}
        />

        <p className="heading--sml">Roles</p>
        <span className="link link--secondary link--noIcon link--disabled">Add a new role</span>

        <div className="flex-content">
          {this.props.wargame.tabs[curTab].data.forces[selectedForce].roles.map((role) => {
            return (<RemovableGroupItem key={role}>{role}</RemovableGroupItem>)
          })}
        </div>
      </div>
    );
  };

  render() {

    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.tabs[curTab].data.selectedForce;

    return (
      <div className="flex-content-wrapper">
        <div className="flex-content">
          <span className="link link--noIcon" onClick={this.openModal}>Add a new force</span>
          <TabsSearchList listData={this.props.wargame.tabs[curTab].data.forces}
                          setSelected={this.setSelected}
                          selected={selectedForce}
          />
        </div>

        {selectedForce ?
          this.createForceEditor()
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
