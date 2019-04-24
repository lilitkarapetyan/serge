import React, {Component} from 'react';
import ModalWrapper from './ModalWrapper';
import "../../scss/App.scss";
import { connect } from 'react-redux';
import { modalAction } from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {
  addNewChannel,
  setSelectedChannel
} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

class AddChannelModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      channelName: ''
    };
  }

  hideModal = () => {

    this.setState({
      channelName: '',
    });

    this.props.dispatch(modalAction.close());
  };


  setChannelName = (e) => {

    this.setState({
      channelName: e.target.value,
      sameName: this.props.wargame.tabs[this.props.wargame.currentTab].data.channels[e.target.value]
    });
  };

  addChannel = () => {
    this.props.dispatch(addNewChannel(this.state.channelName));
    this.props.dispatch(setSelectedChannel(this.state.channelName));
  };

  render() {

    if (!this.props.currentModal.open) return false;

    var disable = this.state.channelName.length < 1 || this.state.sameName;

    return (
      <ModalWrapper>
        <div className="display-text-wrapper">
          <h3>Create channel</h3>
          {this.state.sameName ? <p className="notification">Already exists</p> : false}
          <input autoFocus className="modal-input" type="text" onChange={this.setChannelName} />
          <div className="buttons">
            <button disabled={disable} name="add" className="btn btn-action btn-action--primary" onClick={this.addChannel}>Add</button>
            <button name="cancel" className="btn btn-action btn-action--secondary" onClick={this.hideModal}>Cancel</button>
          </div>
        </div>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = ({ wargame, currentModal }) => ({
  wargame,
  currentModal
});

export default connect(mapStateToProps)(AddChannelModal);
