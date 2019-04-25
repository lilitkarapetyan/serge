import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import {
  setChannel,
  setMessageSchema,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import MessagesList from "./MessagesList";
import NewMessage from "../Components/NewMessage";

import '../scss/App.scss';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class MessageFeeds extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    }
  }

  handleChange = (event, value) => {

    let channel = Object.keys(this.props.playerUi.channels)[value];

    this.props.dispatch(setChannel(channel));
    this.props.dispatch(setMessageSchema({}));

    this.setState({ value });
  };

  createTabs = () => {

    let channels = this.props.playerUi.channels;
    let tabs = [];

    for (let prop in channels) {
      tabs.push(<Tab key={prop} label={prop} />)
    }

    return tabs;
  };

  createMessageList = (tab) => {

    let curChannel= this.props.playerUi.selectedChannel;

    let contents;

    // switch (tab) {
    //
    //   case 0:
    //     contents = (
    //       <>
    //         <MessagesList/>
    //
    //         <NewMessage
    //           templates={this.props.tabs[this.props.curChannel].templates}
    //         />
    //       </>
    //     );
    //     break;
    //
    //   default:
    //     contents = false;
    //     break;
    // }

    return (
      <TabContainer>
        <MessagesList
          curChannel={curChannel}
          messages={this.props.playerUi.messages}
        />

        <NewMessage
          curChannel={curChannel}
          schema={this.props.playerUi.messageSchema}
          templates={this.props.playerUi.channels[curChannel].templates}
        />
      </TabContainer>
    )
  };

  render() {

    const { value } = this.state;
    const { classes } = this.props;

    return (
      <>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              {this.createTabs()}
            </Tabs>
          </AppBar>
          {this.createMessageList(value)}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi,
});

export default connect(mapStateToProps)(withStyles(styles)(MessageFeeds));
