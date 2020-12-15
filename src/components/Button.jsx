import React from "react";


const Button = (props) => {
  

    return(
     <button className={props.className} type={props.type} onClick={props.onClick} disabled={props.isDisabled} >
      {props.className === "button1" ? (<h2> {props.title}</h2>) : (<h3> {props.title} </h3>)}
      </button>
    )
}


export default Button;