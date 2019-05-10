import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import check from "check-types";
import moment from "moment";
const Fragment = React.Fragment;

class MessagePreview extends Component {

  createObjItem(pair) {
    const that = this;
    return (
      <span key={`objItem--${pair[0]}-${pair[1]}`} className="group-section">{ that.deconstructObj(pair[1]) }</span>
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

  createStrItem(pair, withoutName) {
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

  deconstructArr(pair) {
    const that = this;
    return (
      <Fragment key={`${pair[0]}-group`}>
        <span className="detail">{pair[0]}</span>
        {pair[1].map((item) => {
          // CHECK NAME PROP ON EVERY OBJ
          return (
              <span key={`section-${item.name}`}>{ that.deconstructObj(item) }</span>
          );
        })}
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

      if (moment(pair[1], moment.ISO_8601, true).isValid()) return that.createTimeItem(pair);

      return that.createStrItem(pair);

    });
  }


  render() {

    if (!this.props.detail) return false;

    const that = this;
    const keyPropPairs = Object.entries(this.props.detail);

    console.log(this.props.from);

    return keyPropPairs.map((pair, i) => {

      if (i===0) return (
        <Fragment key={'from-force'}>
          { this.props.from.force && this.props.from.role ? <>
            <span className="detail">
              From:
            </span>
            <span className="data">
              {`${this.props.from.force} ${this.props.from.role}`}
            </span></>
          : false }
        </Fragment>
      );

      if (check.object(pair[1])) return that.createObjItem(pair);
      if (check.array.of.object(pair[1])) return that.deconstructArr(pair);
      if (check.boolean(pair[1])) return that.createBoolItem(pair);
      if (moment(pair[1], moment.ISO_8601, true).isValid()) return that.createTimeItem(pair);

      return (
        <Fragment key={`${pair[0]}-${pair[1]}`}>
          <span className="detail">{pair[0]}: </span>
          <span className="data">{pair[1]}</span>
        </Fragment>
      )
    });
  }
}


export default connect()(MessagePreview);
