import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import check from "check-types";
import moment from "moment";
import isValidUrl from "../Helpers/isValidUrl";
import lineBreak from "../Helpers/splitNewLineBreak";
import {
  faUserSecret
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {umpireForceTemplate} from "../consts";
const Fragment = React.Fragment;

class MessagePreview extends Component {

  createObjItem(pair) {
    const that = this;
    return (
      <Fragment key={`objItem--${pair[0]}-${pair[1]}`}>{ that.deconstructObj(pair[1]) }</Fragment>
    )
  }

  createBoolItem(pair) {
    return <span key={`boolItem--${pair[0]}-${pair[1]}`}>{pair[1] ? pair[0] : false}</span>
  }

  createTimeItem(pair) {

    return (
      <Fragment key={`dateTime-${pair[0]}${pair[1]}`}>
        <span className="detail">{pair[0]}:</span>
        <span className="data">{moment(pair[1]).format('DD/MM/YY,HH:mm')}</span>
      </Fragment>
    )
  }

  createStrItem(pair) {
    return (
      <Fragment key={`strItem-${pair[0]}${pair[1]}`}>
        <span className="detail">
          {pair[0]}:
        </span>
        <span className="data">
          {pair[1]}
        </span>
      </Fragment>
    );
  }

  createUrlItem(pair) {
    return (
      <Fragment key={`urlItem-${pair[0]}${pair[1]}`}>
        <span className="detail">
          {pair[0]}:
        </span>
        <span className="data">
          <a href={pair[1]} target="_blank" rel="noopener noreferrer">{pair[1]}</a>
        </span>
      </Fragment>
    );
  }

  deconstructArr(pair) {
    const that = this;
    return (
      <Fragment key={`${pair[0]}-group`}><br/>
        <span className="detail detail-title">{pair[0]}:</span><p className="detail-rows">
        {pair[1].map((item) => {
          // CHECK NAME PROP ON EVERY OBJ
          return (
            <p className="detail-row">
            {that.deconstructObj(item)}
            </p>
          );
        })}
        </p>
      </Fragment>
    );
  }


  deconstructObj(obj) {

    const that = this;
    const keyPropPairs = Object.entries(obj);

    return keyPropPairs.map((pair, i) => {

      if (check.object(pair[1])) return that.createObjItem(pair);
      if (check.array.of.object(pair[1])) return that.deconstructArr(pair);
      if (check.boolean(pair[1])) return that.createBoolItem(pair);
      if (isValidUrl(pair[1])) return that.createUrlItem(pair);
      if (moment(pair[1], moment.ISO_8601, true).isValid()) return that.createTimeItem(pair);

      return that.createStrItem(pair);

    });
  }

  capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };


  render() {

    if (!this.props.detail) return false;

    const that = this;
    const keyPropPairs = Object.entries(this.props.detail);

    return (
      <>
        {keyPropPairs.map((pair, i) => {

          if (check.object(pair[1])) return that.createObjItem(pair);
          if (check.array.of.object(pair[1])) return that.deconstructArr(pair);
          if (check.boolean(pair[1])) return that.createBoolItem(pair);
          if (isValidUrl(pair[1])) return that.createUrlItem(pair);
          if (moment(pair[1], moment.ISO_8601, true).isValid()) return that.createTimeItem(pair);

          return (
            <Fragment key={`${pair[0]}-${pair[1]}`}>
              <span className="detail">{this.capitalize(pair[0])}: </span>
              <span className={"data"}>{lineBreak(pair[1])}</span>
            </Fragment>
          );
        })}
        {this.props.privateMessage &&
         this.props.playerUi.selectedForce === umpireForceTemplate.uniqid && (
            <>
              <span className="detail">
                <FontAwesomeIcon size="1x" icon={faUserSecret}/>
                Private:
              </span>
              <span className="data private">{lineBreak(this.props.privateMessage)}</span>
            </>
          )
        }
      </>
    )
  }
}

const mapStateToProps = ({ playerUi }) => ({
  playerUi
});

export default connect(mapStateToProps)(MessagePreview);
