import React from "react";

const ExecuteQueryButton = props => {
  return <button className="query-page-execute-query-button"
                 disabled={props.loading}
                 onClick={props.onClick}>
    {props.value}
  </button>
}

export default ExecuteQueryButton
