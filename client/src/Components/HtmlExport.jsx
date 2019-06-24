import React from 'react';
import Link from "../Components/Link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const HtmlExport = ({ id }) => (
  <Link href={`/client/export/print/${id}`}>
    <a href="#" className='link link--secondary'><FontAwesomeIcon icon={faPrint} /> print</a>
  </Link>
)

export default HtmlExport;
