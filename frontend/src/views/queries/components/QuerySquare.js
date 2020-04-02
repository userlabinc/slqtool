import React from "react";
import {Input} from "antd";

const QuerySquare = props => {
  const { TextArea } = Input
  return <TextArea
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
