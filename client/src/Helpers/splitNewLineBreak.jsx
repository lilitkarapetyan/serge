import React from "react";
export default function(string) {
  return string.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div> );
};
