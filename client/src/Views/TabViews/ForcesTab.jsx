import React, { Component } from 'react';
import {connect} from "react-redux";
import TabsSearchList from "../../Components/TabsSearchList";
import {
  setSelectedForce,
  setForceOverview,
  saveForce,
  addNewForce,
  deleteSelectedForce,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import '../../scss/App.scss';
import TextArea from "../../Components/Inputs/TextArea";
import RemovableGroupItem from "../../Components/Layout/RemovableGroupItem";
import TextInput from "../../Components/Inputs/TextInput";
import uniqid from "uniqid";

import {forceTemplate} from "../../api/consts";
import _ from "lodash";
import checkUnique from "../../Helpers/checkUnique";
import {addNotification} from "../../ActionsAndReducers/Notification/Notification_ActionCreators";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

class ForcesTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newForceName: null,
      forcesList: this.props.wargame.data[this.props.wargame.currentTab].forces,
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {

    const curSelected = this.props.wargame.data[this.props.wargame.currentTab].selectedForce;
    const nextSelected = nextProps.wargame.data[nextProps.wargame.currentTab].selectedForce;
    const curPropsState = this.props.wargame.data[this.props.wargame.currentTab].forces;
    const nextPropsState = nextProps.wargame.data[nextProps.wargame.currentTab].forces;

    if (curPropsState.length !== nextPropsState.length || curSelected !== nextSelected) {
      this.setState({
        forcesList: nextProps.wargame.data[nextProps.wargame.currentTab].forces
      });
    }

    if (curSelected !== nextSelected) {
      this.setState({
        newForceName: null,
      });
    }
  }

  createForce = () => {
    let name = 'force-' + uniqid.time();
    this.props.dispatch(addNewForce(name));
    this.props.dispatch(setSelectedForce(name));

    let template = forceTemplate;
    template.forceName = name;

    this.props.dispatch(saveForce(this.props.wargame.currentWargame, name, template, name));

    this.setState({
      newForceName: null,
    });
  };

  setSelected = (force) => {
    this.props.dispatch(setSelectedForce(force));
  };

  updateOverview = (overview) => {
    this.props.dispatch(setForceOverview(overview));
  };

  checkUnique() {
    const curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data[curTab].selectedForce;

    let forceNames = this.props.wargame.data[curTab].forces.map((force) => force.forceName);
    forceNames = _.pull(forceNames, selectedForce);

    if (!checkUnique(this.state.newForceName, forceNames)) {
      this.props.dispatch(addNotification("Force name is not unique.", "warning"));
      return false;
    }
    return true;
  }

  saveForce = () => {

    const curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data[curTab].selectedForce;

    let newForceData = this.props.wargame.data[curTab].forces.find((f) => f.forceName === selectedForce);

    if (typeof this.state.newForceName === 'string' && this.state.newForceName.length > 0) {

      if (!this.checkUnique()) return;

      this.props.dispatch(saveForce(this.props.wargame.currentWargame, this.state.newForceName, newForceData, selectedForce));
    }

    if (this.state.newForceName === null) {
      this.props.dispatch(saveForce(this.props.wargame.currentWargame, selectedForce, newForceData, selectedForce));
    } else if (this.state.newForceName.length === 0) {
      alert('no channel name');
    }
  };

  deleteForce = () => {
    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data[curTab].selectedForce;
    this.props.dispatch(deleteSelectedForce(this.props.wargame.currentWargame, selectedForce));
  };

  updateForceName = (name) => {
    this.setState({
      newForceName: name,
    })
  };

  createForceEditor() {

    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data[curTab].selectedForce;

    let forceName = typeof this.state.newForceName === 'string' ? this.state.newForceName : selectedForce;

    return (
      <div className="flex-content--fill forcesTab">

        <TextInput
          id="channel-editable"
          updateStore={this.updateForceName}
          options={{numInput: false}}
          data={forceName}
          validInput={this.props.wargame.validation.validForceName}
        />

        <span className="link link--noIcon" onClick={this.saveForce}>save force</span>
        <span className="link link--secondary" onClick={this.deleteForce}><FontAwesomeIcon icon={faTrash} />Delete</span>

        <span className="link link--secondary link--noIcon link--disabled">Change icon</span>

        <p className="heading--sml">Overview &amp; Objectives</p>
        <TextArea
          updateStore={this.updateOverview}
          data={this.props.wargame.data[curTab].forces.find((force) => force.forceName === selectedForce).overview}
        />

        <p className="heading--sml">Roles</p>
        <span className="link link--secondary link--noIcon link--disabled">Add a new role</span>

        <div className="flex-content">
          {this.props.wargame.data[curTab].forces.find((force) => force.forceName === selectedForce).roles.map((role) => {
            return (<RemovableGroupItem key={role}>{role}</RemovableGroupItem>)
          })}
        </div>
      </div>
    );
  };

  render() {

    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data[curTab].selectedForce;

    return (
      <div className="flex-content-wrapper">
        <div className="flex-content">
          <span className="link link--noIcon" onClick={this.createForce}>Add a new force</span>
          <TabsSearchList listData={this.state.forcesList.map((force) => force.forceName)}
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
