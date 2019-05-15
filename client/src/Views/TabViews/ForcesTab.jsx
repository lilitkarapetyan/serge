import React, { Component } from 'react';
import {connect} from "react-redux";
import TabsSearchList from "../../Components/TabsSearchList";
import {
  setSelectedForce,
  saveForce,
  addNewForce,
  deleteSelectedForce,
  setTabUnsaved,
  setTabSaved,
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
import {modalAction} from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import classNames from "classnames";

class ForcesTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newForceName: null,
      newForceOverview: null,
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
        newForceOverview: null,
      });
    }
  }

  createForce = () => {

    const curTab = this.props.wargame.currentTab;

    if (this.props.wargame.data[curTab].dirty) {
      this.props.dispatch(modalAction.open("unsavedForce", "create-new"));
    } else {

      let name = 'force-' + uniqid.time();
      this.props.dispatch(addNewForce(name));
      this.props.dispatch(setSelectedForce(name));

      let template = forceTemplate;
      template.forceName = name;

      this.props.dispatch(saveForce(this.props.wargame.currentWargame, name, template, name));

      this.setState({
        newForceName: null,
      });

    }
  };

  setSelected = (force) => {
    const curTab = this.props.wargame.currentTab;

    if (this.props.wargame.data[curTab].dirty) {
      this.props.dispatch(modalAction.open("unsavedForce", force));
    } else {
      this.props.dispatch(setTabSaved());
      this.props.dispatch(setSelectedForce(force));
    }
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
    let forceOverview = typeof this.state.newForceOverview === 'string' ? this.state.newForceOverview : this.props.wargame.data[curTab].forces.find((force) => force.forceName === selectedForce).overview;

    newForceData.overview = forceOverview;

    if (typeof this.state.newForceName === 'string' && this.state.newForceName.length > 0) {
      if (!this.checkUnique()) return;
      this.props.dispatch(saveForce(this.props.wargame.currentWargame, this.state.newForceName, newForceData, selectedForce));
    }

    if (this.state.newForceName === null) {
      this.props.dispatch(saveForce(this.props.wargame.currentWargame, selectedForce, newForceData, selectedForce));
    } else if (this.state.newForceName.length === 0) {
      this.props.dispatch(addNotification("No Force Name", "warning"));
    }
  };

  deleteForce = () => {

    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data[curTab].selectedForce;
    let isUmpire = this.props.wargame.data[curTab].forces.find((f) => f.forceName === selectedForce).umpire;

    if (isUmpire) return;

    this.props.dispatch(deleteSelectedForce(this.props.wargame.currentWargame, selectedForce));
  };

  updateForceName = (name) => {
    this.props.dispatch(setTabUnsaved());
    this.setState({
      newForceName: name,
    })
  };

  updateForceOverview = (desc) => {
    this.props.dispatch(setTabUnsaved());
    this.setState({
      newForceOverview: desc,
    })
  };

  addNewRoleModal = () => {
    this.props.dispatch(modalAction.open("newRole"));
  };

  checkWargameHasGameController = () => {

    let forces = this.props.wargame.data.forces.forces;

    let doesHave = false;
    for (let i=0 ; i<forces.length ; i++) {
      let force = forces[i];
      doesHave = force.roles.some((role) => role.control === true);
      if (doesHave) break;
    }
    return doesHave;
  };

  createForceEditor() {

    let curTab = this.props.wargame.currentTab;
    let selectedForce = this.props.wargame.data[curTab].selectedForce;

    let isUmpire = this.props.wargame.data[curTab].forces.find((f) => f.forceName === selectedForce).umpire;

    let forceName = typeof this.state.newForceName === 'string' ? this.state.newForceName : selectedForce;
    let forceOverview = typeof this.state.newForceOverview === 'string' ? this.state.newForceOverview : this.props.wargame.data[curTab].forces.find((force) => force.forceName === selectedForce).overview;

    return (
      <div className="flex-content--fill forcesTab">

        <div className="flex-content--row">
          <TextInput
            id="channel-editable"
            updateStore={this.updateForceName}
            options={{numInput: false}}
            data={forceName}
          />

          <span className="link link--noIcon" onClick={this.saveForce}>save force</span>
          <span className={classNames({"link": true, "link--secondary": true, "link--disabled": isUmpire})} onClick={this.deleteForce}><FontAwesomeIcon icon={faTrash} />Delete</span>

          <span className="link link--secondary link--noIcon link--disabled">Change icon</span>
        </div>

        <p className="heading--sml">Overview &amp; Objectives</p>
        <TextArea
          updateStore={this.updateForceOverview}
          data={forceOverview}
        />

        <p className="heading--sml">Roles</p>
        <span className="link link--secondary link--noIcon" onClick={this.addNewRoleModal}>Add a new role</span>

        <div className="flex-content">
          {!this.checkWargameHasGameController() ?
            <p>At least one force needs role with game control</p> : false
          }
          <div className="roles">
            {this.props.wargame.data[curTab].forces.find((force) => force.forceName === selectedForce).roles.map((role) => {
              return (<RemovableGroupItem key={role.name} isControl={role.control}>{role.name}</RemovableGroupItem>)
            })}
          </div>
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
