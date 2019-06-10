import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../../scss/App.scss';
import Select from "react-select";
import SelectAll from "../SelectAllSelect";
import {
  faCheck,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class EditSubscriptionRow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      subscriptionId: this.props.data.subscriptionId,
      editSubscriptionForce: {value: this.props.data.force, label: this.props.data.force},
      editSubscriptionRoles: this.props.data.roles,
      editSubscriptionTemplates: this.props.data.templates,
    };
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

    let subscriptionData = {
      force: this.state.editSubscriptionForce.label,
      roles: this.state.editSubscriptionRoles,
      templates: this.state.editSubscriptionTemplates,
      forceUniqid: this.props.data.forceUniqid,
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
          <SelectAll
            value={this.state.editSubscriptionRoles}
            options={this.props.roleOptions}
            onChange={this.updateSubscriptionRole}
            isMulti
            allowSelectAll={true}
          />
        </td>
        <td>
          <SelectAll
            value={this.state.editSubscriptionTemplates}
            options={this.props.templateOptions}
            onChange={this.updateSubscriptionTemplates}
            isMulti
            allowSelectAll={true}
          />
        </td>
        <td>
          <FontAwesomeIcon icon={faUndoAlt} onClick={this.cancelEdit} />
          <FontAwesomeIcon icon={faCheck} onClick={this.updateChannel} />
        </td>
      </tr>
    )
  }
}


export default connect()(EditSubscriptionRow);
