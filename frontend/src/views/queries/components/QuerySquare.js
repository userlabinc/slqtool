import React from "react";

const QuerySquare = props => {
  return <textarea
     disabled={props.loading}
    className={"query-square " + props.className}
    onChange={event => props.setQuery(event.target.value)}
    value={props.query}
    />
}

QuerySquare.defaultProps = {
  className: "",
  loading:false,
  style: {}
}
export default QuerySquare
