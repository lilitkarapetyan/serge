import React, { Component } from 'react';
import { connect } from 'react-redux';

import Link from "../Components/Link";

import '../scss/App.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

class UmpireMenu extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="umpire" className="flex-content-wrapper">
        <div className="flex-content flex-content--fill">
          <Link href="/client/umpireMenu" class="link link--secondary link--large">Umpire Menu</Link>
          <Link href="/client/playerUi" class="link link--secondary link--large">Player UI</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({  }) => ({

});

export default connect(mapStateToProps)(UmpireMenu);
