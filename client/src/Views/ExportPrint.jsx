import React, { Component } from 'react';
import { connect } from "react-redux";

import Link from "../Components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getAllMessageTypes } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import { createExportItem } from "../ActionsAndReducers/ExportItems/ExportItems_ActionsCreators";
import ExcelExport from '../Components/ExcelExport';
import { setCurrentViewFromURI } from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_ActionCreators";

const ExportPrint = ({ exportItem, notFound }) => {

  if(!exportItem) {
    // notFound();
  }

  console.log(exportItem);

  return (
    <div className='print-canvas'>
      {exportItem.data.map((data, pageIndex) => (
        <section key={pageIndex}>
          <h2>{exportItem.wargame}</h2>
          <h4>{exportItem.type}</h4>
          <hr/>
          <table>
            <tbody>
              {data.items.map((row, key) => (
                <tr key={key}>
                  {row.map(col => ( key ? (<td key={key}>{col}</td>) : (<th key={key}>{col}</th>) ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
// export default ExportView;
const mapStateToProps = ({exportItems, currentViewURI}) => ({
  exportItem: exportItems[currentViewURI.split('/')[4]] || null
});

const mapDispatchToProps = dispatch => ({
  notFound: () => { dispatch(setCurrentViewFromURI('/client/export')) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportPrint);
