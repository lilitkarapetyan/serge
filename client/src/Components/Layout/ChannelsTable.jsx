import React, { Component } from 'react';
import { connect } from "react-redux";

import {
  addRecipientToChannel,
  updateRecipient,
  removeRecipient,
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators.js";

import EditSubscriptionRow from "./EditSubscriptionRow";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faUndoAlt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames";
import {setTabUnsaved} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class ChannelsTable extends Component {

  constructor(props) {
    super(props);

    let forceOptions = this.props.wargame.data.forces.forces.map((f) => ({ value: f.forceName, label: f.forceName }));

    let templateOptions = this.props.messageTypes.messages.map((messageType) => {
      return {
        value: messageType._id,
        label: messageType.title,
      }
    });

    this.state = {
      selectedForce: {value: null, label: null},
      forceOptions: forceOptions,
      selectedRole:  {value: null, label: null},
      roleOptions: [],
      selectedTemplates:  [],
      templateOptions: templateOptions,
      subscriptionToEdit: null,
      editSubscriptionForce: '',
      editSubscriptionRole: '',
      editSubscriptionTemplates: [],
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {

    if (nextState.selectedForce.value === null) return;

    if (this.state.selectedForce.value !== nextState.selectedForce.value) {

      let roleOptions = [];

      let roles = this.props.wargame.data.forces.forces.find((f) => f.forceName === nextState.selectedForce.value).roles;

      roles.forEach((role) => {

        roleOptions.push({
          value: role.name,
          label: role.name,
        });
      });

      this.setState({
        roleOptions,
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.wargame.data.channels.selectedChannel !== nextProps.wargame.data.channels.selectedChannel) {
      this.setState({
        selectedForce: {value: null, label: null},
        selectedRole:  {value: null, label: null},
        selectedTemplates: [],
      })
    }
  }

  createRow(data, i) {
    var row = [];
    for (var prop in data) {
      if (prop === "subscriptionId") continue;

      var value = '';
      if (typeof data[prop] !== "string") {

        for (var j=0 ; j<data[prop].length ; j++) {
          let item = data[prop][j];
          value += item.label;
          if (j !== data[prop].length-1) value+=', ';
        }
      } else {
        value = data[prop];
      }
      row.push(<td key={`${value}${i}`}>{value}</td>)
    }
    row.push(
      <td key={`edit-delete${i}`}>
        <FontAwesomeIcon icon={faTrash} onClick={this.removeSubscription.bind(this, data.subscriptionId)} />
        <FontAwesomeIcon icon={faPencilAlt} onClick={this.editSubscription.bind(this, data.subscriptionId)} />
      </td>
    );
    return (<tr key={`row-${i}`}>{row}</tr>);
  }

  removeSubscription(subscriptionId) {
    this.props.dispatch(setTabUnsaved());
    this.props.dispatch(removeRecipient(subscriptionId))
  };

  editSubscription(subscriptionId) {
    this.setState({
      subscriptionToEdit: subscriptionId,
    });
  }

  cancelEdit = () => {
    this.setState({
      subscriptionToEdit: "",
    });
  };

  updateRecipient = (id, data) => {
    this.props.dispatch(setTabUnsaved());
    this.props.dispatch(updateRecipient(id, data));
  };

  setSelectedForce = (option) => {
    this.setState({
      selectedForce: option,
    });
  };

  setSelectedRole = (option) => {
    this.setState({
      selectedRole: option,
    });
  };

  setSelectedTemplate = (option) => {
    this.setState({
      selectedTemplates: option,
    });
  };

  addToChannel = () => {

    let rowComplete = this.state.selectedTemplates.length > 0;

    if (!rowComplete) return;

    let channelData = {
      force: this.state.selectedForce.value,
      role: this.state.selectedRole.value,
      templates: this.state.selectedTemplates,
    };
    this.props.dispatch(setTabUnsaved());
    this.props.dispatch(addRecipientToChannel(channelData));

    this.setState({
      selectedForce: {value: null, label: null},
      selectedRole: {value: null, label: null},
      selectedTemplates: [],
    });
  };

  clearChannelData = () => {
    this.setState({
      selectedForce: {value: null, label: null},
      selectedRole: {value: null, label: null},
      selectedTemplates: [],
    });
  };

  render() {

    let rowComplete = this.state.selectedTemplates.length > 0;

    return (
      <div className="flex-content">
        <table>
          <thead>
            <tr>
              <th>Force</th>
              <th>Roles</th>
              <th>Templates</th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((data, i) => {
              return data.subscriptionId === this.state.subscriptionToEdit ? <EditSubscriptionRow
                                                                                  key={data.subscriptionId}
                                                                                  data={data}
                                                                                  forceOptions={this.state.forceOptions}
                                                                                  roleOptions={this.state.roleOptions}
                                                                                  templateOptions={this.state.templateOptions}
                                                                                  cancelEdit={this.cancelEdit}
                                                                                  updateRecipient={this.updateRecipient}
                                                                            /> : this.createRow(data, i);
            })}
            <tr>
              <td>
                <Select
                  value={this.state.selectedForce}
                  options={this.state.forceOptions}
                  onChange={this.setSelectedForce}
                />
              </td>
              <td>
                <Select
                  value={this.state.selectedRole}
                  options={this.state.roleOptions}
                  onChange={this.setSelectedRole}
                  isDisabled={!this.state.selectedForce.value}
                />
              </td>
              <td>
                <Select
                  value={this.state.selectedTemplates}
                  options={this.state.templateOptions}
                  onChange={this.setSelectedTemplate}
                  isDisabled={!this.state.selectedRole.value}
                  isMulti
                />
              </td>
              <td>
                <FontAwesomeIcon icon={faUndoAlt} onClick={this.clearChannelData} />
                <FontAwesomeIcon icon={faCheck} className={classNames({"btn--disabled": !rowComplete})} onClick={this.addToChannel} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = ({ wargame, messageTypes }) => ({
  wargame,
  messageTypes,
});

export default connect(mapStateToProps)(ChannelsTable);
