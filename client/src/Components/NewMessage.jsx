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
      dropdownValue: '',
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.curChannel !== nextProps.curChannel) {
      this.setState({
        dropdownValue: '',
      })
    }
  }

  setTemplate = (val) => {
    this.props.dispatch(getMessageTemplate(val));
    this.setState({
      dropdownValue: val,
    });
  };


  render() {

    const templates = this.props.templates.map((item) => ({value: item.value, option: item.label }));

    // if (templates.length === 1) this.props.dispatch(getMessageTemplate(templates[0].value));

    return (
      <div className="new-message-creator wrap">
        <Collapsible
          trigger={"New Message"}
          transitionTime={200}
          easing={'ease-in-out'}
        >
          {/*{templates.length > 1 &&*/}
            <DropdownInput
              updateStore={this.setTemplate}
              data={this.state.dropdownValue}
              selectOptions={templates}
              placeholder="Select message"
              className="message-input"
            />
          {/*}*/}
          <MessageCreator
            schema={this.props.schema}
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
