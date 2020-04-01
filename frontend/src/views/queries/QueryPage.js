import React, {useState} from "react";
import QuerySquare from "./components/QuerySquare";

const QueryPage = () =>  {
  const [query, setQuery ] = useState('')
  const executeQuery = () => {

  }

  function createGist() {
    console.log('Posting request to  API...');
    fetch('https://api.github.com/gists', {
      method: 'post',
      body: JSON.stringify({query})
    })
    .then(function(response) {
      return response.json();
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{})
  }

  return <div className="query-page">
    <div className="query-square-wrapper">
      <div className="query-page-inner-wrapper">
        <QuerySquare query={query} setQuery={setQuery}/>
        <button className="query-page-execute-query-button">Make Query</button>
      </div>
    </div>
  </div>
}

export default QueryPage
