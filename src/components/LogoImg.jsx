import React from "react";

const logo = require("../trump.gif")

const LogoImg = (props) => {
    return (
        <img className={props.className} src={logo} alt="logo" />

    )
}
         
export default LogoImg  