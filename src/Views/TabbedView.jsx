import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SettingsTab from "./TabViews/SettingsTab";
import ForcesTab from "./TabViews/ForcesTab";
import ChannelsTab from "./TabViews/ChannelsTab";
import ValidationNotification from "../Components/ValidationNotification";
import {getAllMessageTypes} from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";

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


class TabbedView extends Component {

  constructor(props) {
    super(props);

    console.log(this.props.tabs);

    this.state = {
      value: 0,
      tabs: Object.values(this.props.tabs).map((item) => item.name),
      invalidFields: [],
    };
  }

  componentDidMount() {
    this.props.setCurrentTab(0);
  }


  handleChange = (event, value) => {
    this.setState({ value });
    this.props.setCurrentTab(value);
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
              { this.state.tabs.map((tabName, i) => <Tab key={tabName + i} label={tabName} />) }
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><SettingsTab /></TabContainer>}
          {/*{value === 1 && <TabContainer>PlatformTypes.jsx</TabContainer>}*/}
          {value === 1 && <TabContainer><ForcesTab /></TabContainer>}
          {/*{value === 3 && <TabContainer>BackHistory.jsx</TabContainer>}*/}
          {/*{value === 4 && <TabContainer>Positions.jsx</TabContainer>}*/}
          {value === 2 && <TabContainer><ChannelsTab /></TabContainer>}
          {/*{value === 6 && <TabContainer>PlayControl.jsx</TabContainer>}*/}
        </div>
        <ValidationNotification validation={ this.props.wargame.validation } />
      </>
    );
  }
}

const mapStateToProps = ({ wargame }) => ({
  wargame
});

export default connect(mapStateToProps)(withStyles(styles)(TabbedView));
