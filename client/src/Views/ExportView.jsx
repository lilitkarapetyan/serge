import React, { Component } from 'react';
import { connect } from "react-redux";

import Link from "../Components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { createExportItem } from "../ActionsAndReducers/ExportItems/ExportItems_ActionsCreators";
import ExcelExport from '../Components/ExcelExport';
import { setCurrentViewFromURI } from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_ActionCreators";

class ExportView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabs: [
        { title: 'Export Messages', url: '/client/export/messages', urlalt: '/client/export' },
        { title: 'Export Forces', url: '/client/export/forces', urlalt: null }
      ]
    }
  }

  checkTab = tab => (tab.url === this.props.currentViewURI || tab.urlalt === this.props.currentViewURI ? "active-tab" : '')

  render() {
    console.log(this.props);
    return (
      <div className="view-wrapper view-wrapper-gamesetup">
        <ul className="tab-nav">
          {this.state.tabs.map(tab => (
            <li className={this.checkTab(tab)} onClick={() => { this.props.setTab(tab.url) }}>{tab.title}</li>
          ))}
        </ul>
        <div id="sidebar">
          <Link onClickHandler={this.notSavedNotification} href="/client/umpireMenu" id="home-btn"><FontAwesomeIcon icon={faArrowLeft} size="2x" /></Link>
        </div>
        <div className="export-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
// export default ExportView;
const mapStateToProps = ({currentViewURI}) => ({currentViewURI});

const mapDispatchToProps = dispatch => ({
  setTab: tab => { dispatch(setCurrentViewFromURI(tab)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportView);
