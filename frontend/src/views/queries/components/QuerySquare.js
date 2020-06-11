import React, { useEffect } from 'react';
import keywords from './SintaxDictionary'

const QuerySquare = props => {

  useEffect(() => {
    let $divQuery = document.getElementById('editor');
    let timeout

    $divQuery.addEventListener("keyup", function(e){
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        let newHTML = "";
        e.target.innerText.replace(/[\s]+/g, " ").trim().split(" ").forEach(function(val){
          if (keywords.indexOf(val.trim().toUpperCase()) > -1)
            newHTML += "<span class='statement'>" + val + "&nbsp;</span>";
          else
            newHTML += "<span class='other'>" + val + "&nbsp;</span>";
        });
        e.target.innerHTML = newHTML;
        let child = e.target.children;
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(child[child.length-1], 1);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        this.focus();
        clearTimeout(timeout)
        props.setQuery(document.getElementById('editor').textContent)
      },1000)
    });
  });

  return (
    <>
    <div
    id = "editor"
    contentEditable = {true}/>
      </>
  )
}

QuerySquare.defaultProps = {
  className: '',
  loading: false,
  style: {},
}


export default QuerySquare
