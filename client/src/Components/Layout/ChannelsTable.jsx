import React, { Component } from 'react';
import { connect } from "react-redux";
import classNames from "classnames";

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
} from "@fortawesome/free-solid-svg-icons";

class ChannelsTable extends Component {

  constructor(props) {
    super(props);

    var tabs = Object.values(this.props.wargame.tabs);
    let forces = tabs.find((d) => d.name === "Forces").data.forces;

    let forceOptions = [];
    for (let prop in forces) {
      forceOptions.push({
        value: prop,
        label: prop,
      });
    }

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

      var tabs = Object.values(this.props.wargame.tabs);

      let roleOptions = [];
      var roles = tabs.find((d) => d.name === "Forces").data.forces[nextState.selectedForce.value].roles;

      roles.forEach((role) => {

        roleOptions.push({
          value: role,
          label: role,
        });
      });

      this.setState({
        roleOptions,
      });
    }
  }

  createRow(data, i) {
    var row = [];
    for (var prop in data) {
      if (prop === "subscriptionId") continue;

      var value = '';
      if (typeof data[prop] !== "string") {
        data[prop].forEach((item, i) => {
          value += item.label;
          if (i !== data[prop].length-1) value+=', ';
        });
      } else {
        value = data[prop];
      }
      row.push(<td key={`${value}i`}>{value}</td>)
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

    let channelData = {
      force: this.state.selectedForce.value,
      role: this.state.selectedRole.value,
      templates: this.state.selectedTemplates,
    };
    this.props.dispatch(addRecipientToChannel(channelData));

    this.setState({
      selectedForce: {value: null, label: null},
      selectedRole: {value: null, label: null},
      selectedTemplates: [],
    });
  };

  render() {

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
                <button
                  className="btn btn-action btn-action--secondary"
                  onClick={this.addToChannel}
                  disabled={!this.state.selectedTemplates.length > 0}>
                  Save</button>
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
