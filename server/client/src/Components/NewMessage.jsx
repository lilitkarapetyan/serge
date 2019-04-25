import React, { Component } from 'react';
import PropTypes from "prop-types";
import Select from "react-select";
import '../scss/App.scss';
import {connect} from "react-redux";
import {
  getMessageTemplate,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessageCreator from "../Components/MessageCreator.jsx";

class NewMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      template: {value: '', label: ''},
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.curChannel !== nextProps.curChannel) {
      this.setState({
        template: {value: '', label: ''},
      });
    }
  }

  setTemplate = (val) => {
    this.props.dispatch(getMessageTemplate(val.value));
    this.setState({
      template: val,
    })
  };

  render() {
    return (
      <>
        <Select
          value={this.state.template}
          options={this.props.templates}
          onChange={this.setTemplate}
        />
        <MessageCreator schema={this.props.schema} />
      </>
    );
  }
}

NewMessage.propTypes = {
  templates: PropTypes.array.isRequired,
};

const mapStateToProps = ({  }) => ({

});

export default connect(mapStateToProps)(NewMessage);
