import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SettingsTab from "./TabViews/SettingsTab";
import ForcesTab from "./TabViews/ForcesTab";
import ChannelsTab from "./TabViews/ChannelsTab";
// import ValidationNotification from "../Components/ValidationNotification";
import classNames from "classnames";

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

    this.state = {
      value: 0,
      activeTab: Object.keys(this.props.tabs)[0],
      tabs: Object.keys(this.props.tabs),
      invalidFields: [],
    };
  }

  componentDidMount() {
    this.props.setCurrentTab(Object.keys(this.props.tabs)[0]);
  }

  changeTab = (value) => {
    this.setState({ activeTab: value });
    this.props.setCurrentTab(value);
  };

  render() {
    return (
      <>
        <ul className="tab-nav">
          { this.state.tabs.map((tabName, i) => (
                <li key={tabName}
                    onClick={this.changeTab.bind(this, this.state.tabs[i])}
                    className={classNames({ "active-tab": tabName === this.state.activeTab })}
                >{tabName}</li>
              )
            )
          }
        </ul>
        <div className="flex-content-margin">
          {this.state.activeTab === this.state.tabs[0] && <SettingsTab />}
          {this.state.activeTab === this.state.tabs[1] && <ForcesTab />}
          {this.state.activeTab === this.state.tabs[2] && <ChannelsTab />}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ wargame }) => ({
  wargame
});

export default connect(mapStateToProps)(withStyles(styles)(TabbedView));
