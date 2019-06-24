import React from 'react';
import Link from "../Components/Link";

import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const HtmlExport = ({ id }) => (
  <Link href={`/client/export/print/${id}`} className='link link--secondary'>
    <FontAwesomeIcon icon={faArrowLeft} /> print
  </Link>
)

export default HtmlExport;
