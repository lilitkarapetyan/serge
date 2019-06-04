import React, { Component } from 'react';
import PropTypes from "prop-types";
import '../scss/App.scss';
import {connect} from "react-redux";
import {
  getMessageTemplate,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessageCreator from "../Components/MessageCreator.jsx";
import Collapsible from "react-collapsible";
import DropdownInput from "../Components/Inputs/DropdownInput";

class NewMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedSchema: null,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.curChannel !== nextProps.curChannel) {
      this.setState({
        selectedSchema: null,
      })
    }
    if (this.props.templates.length === 1) {
      this.setState({
        selectedSchema: this.props.templates[0].details,
      })
    }
  }

  setTemplate = (val) => {
    this.setState({
      selectedSchema: JSON.parse(val),
    });
  };


  render() {

    const templates = this.props.templates.map((item) => ({value: JSON.stringify(item.details), option: item.title }));

    return (
      <div className="new-message-creator wrap">
        <Collapsible
          trigger={"New Message"}
          transitionTime={200}
          easing={'ease-in-out'}
        >
          {templates.length > 1 &&
            <DropdownInput
              updateStore={this.setTemplate}
              // data={this.state.dropdownValue}
              selectOptions={templates}
              placeholder="Select message"
              className="message-input"
            />
          }
          <MessageCreator
            schema={this.state.selectedSchema}
            curChannel={this.props.curChannel}
          />
        </Collapsible>
      </div>
    );
  }
}

NewMessage.propTypes = {
  templates: PropTypes.array.isRequired,
};

const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(NewMessage);
