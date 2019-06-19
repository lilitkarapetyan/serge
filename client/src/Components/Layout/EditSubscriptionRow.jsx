import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../../scss/App.scss';
import Select from "react-select";
import {
  faCheck,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import _ from "lodash";

class EditSubscriptionRow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      subscriptionId: this.props.data.subscriptionId,
      editSubscriptionForce: {value: this.props.data.force, label: this.props.data.force},
      editSubscriptionRoles: this.props.data.roles,
      editSubscriptionTemplates: this.props.data.templates,
    };

    console.log(this.props.data.templates);
  }

  updateSubscriptionForce = (option) => {
    this.setState({
      editSubscriptionForce: option,
    });
  };

  updateSubscriptionRole = (option) => {
    this.setState({
      editSubscriptionRoles: option,
    });
  };

  updateSubscriptionTemplates = (option) => {
    this.setState({
      editSubscriptionTemplates: option,
    });
  };

  updateChannel = () => {

    let templateIds = this.state.editSubscriptionTemplates.map(function(template) {
      if (typeof template.value === "string") {
        return {_id: template.value};
      }
      return {_id: template.value._id};
    });
    let templates = _.intersectionBy(this.props.messageTypes.messages, templateIds, (item) => item._id);
        templates = templates.map((template) => ({label: template.title, value: template}));

    let subscriptionData = {
      force: this.state.editSubscriptionForce.label,
      roles: this.state.editSubscriptionRoles,
      templates,
      forceUniqid: this.props.data.forceUniqid,
      icon: this.props.data.icon,
    };
    this.props.updateRecipient(this.state.subscriptionId, subscriptionData);
    this.props.cancelEdit();
  };

  cancelEdit = () => {
    this.props.cancelEdit();
  };

  render() {
    return (
      <tr>
        <td>
          <Select
            value={this.state.editSubscriptionForce}
            options={this.props.forceOptions}
            onChange={this.updateSubscriptionForce}
          />
        </td>
        <td>
          <Select
            value={this.state.editSubscriptionRoles}
            options={this.props.roleOptions}
            onChange={this.updateSubscriptionRole}
            isMulti
          />
        </td>
        <td>
          <Select
            value={this.state.editSubscriptionTemplates}
            options={this.props.templateOptions}
            onChange={this.updateSubscriptionTemplates}
            isMulti
          />
        </td>
        <td>
          <FontAwesomeIcon icon={faUndoAlt} title="Cancel" onClick={this.cancelEdit} />
          <FontAwesomeIcon icon={faCheck} title="Save" onClick={this.updateChannel} />
        </td>
      </tr>
    )
  }
}


export default connect()(EditSubscriptionRow);
