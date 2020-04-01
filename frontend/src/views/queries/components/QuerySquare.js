import React from "react";

const QuerySquare = props => {
  return <textarea
    className={"query-square " + props.className}
    onChange={event => props.setQuery(event.target.value)}
    value={props.query}
    />
}

QuerySquare.defaultProps = {
  className: "",
  style: {}
}
export default QuerySquare
