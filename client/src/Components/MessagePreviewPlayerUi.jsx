import React, { Component } from 'react';
import {connect} from 'react-redux';

import '../scss/App.scss';
import check from "check-types";
import moment from "moment";

class MessagePreview extends Component {

  createObjItem(pair) {
    const that = this;
    return (
      <>
        {/*<h3>{pair[0]}</h3>*/}
        <span key={`objItem--${pair[0]}-${pair[1]}`} className="group-section">{ that.deconstructObj(pair[1]) }</span>
      </>
    )
  }

  createBoolItem(pair) {
    return <span key={`boolItem--${pair[0]}-${pair[1]}`}>{pair[1] ? pair[0] : false}</span>
  }

  createTimeItem(pair) {

    return (
      <>
        <span className="detail">{pair[0]}:</span>
        <span key={`dateTime-${pair[1]}`} className="data">{moment(pair[1]).format('DD/MM/YY,HH:mm')}</span>
      </>
    )
  }

  createStrItem(pair, withoutName) {
    return <>
      <span key={`strItem-${pair[0]}`} className="detail">
        {pair[0]}:
      </span>
      <span className="data">
        {pair[1]}
      </span>
      </>
  }

  deconstructArr(pair) {
    const that = this;
    return (
      <>
        <span  className="detail">{pair[0]}</span>
        {pair[1].map((item) => {
          // CHECK NAME PROP ON EVERY OBJ
          return (
              <span key={`section-${item.name}`}>{ that.deconstructObj(item) }</span>
          );
        })}
      </>
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


    return keyPropPairs.map((pair, i) => {

      if (i===0) return (
        <>
          { this.props.from ? <>
            <span key={'from'} className="detail">
              From:
            </span>
            <span className="data">
              {this.props.from}
            </span></>
          : false }
        </>
      );

      if (check.object(pair[1])) return that.createObjItem(pair);
      if (check.array.of.object(pair[1])) return that.deconstructArr(pair);
      if (check.boolean(pair[1])) return that.createBoolItem(pair);
      if (moment(pair[1], moment.ISO_8601, true).isValid()) return that.createTimeItem(pair);

      return (
        <>
          <span className="detail">{pair[0]}: </span>
          <span key={`${pair[0]}-${pair[1]}`} className="data">{pair[1]}</span>
        </>
      )
    });
  }
}


export default connect()(MessagePreview);
