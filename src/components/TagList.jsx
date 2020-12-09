import React from "react";

const TagList = (props) => {
  return (
  <p>
    {props.storedTags.map((tag, index) => 
      <span key={`tag-${index}`}>
        <a
          name={tag}
          onClick={props.onTagClick}
          className={props.selectedTag === tag ? "App-link-selected" : "App-link"}
          href="#"
          >
          {tag}
        </a>
        {index === props.storedTags.length - 1 ? '' : ' | ' }{/* confrontiamo l'array che ci arriva con l'indice dell'attuale elemento nell'array */}
      </span>
    )}
  </p>
)}
export default TagList