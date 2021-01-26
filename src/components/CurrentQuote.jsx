import React from "react";
import Button from "./Button";

const CurrentQuote= (props) => { 

    
    /* if (props && props.objQuote && props.objQuote._embedded && props.objQuote._embedded.source && props.objQuote._embedded.source.length >0 ) console.log("aaaaa", props.objQuote._embedded.source[0].url) */ 
    console.log("aaa:", props.isListMode)
    return    props.isListMode 
    ? (<><q> {props.objQuote.value } </q>
        <Button className="button3" type="button" title="REMOVE!" onClick={props.onClick}/> </>)
    : (
        <>
            <p> {props.objQuote.value } </p>
            <p> {props.objQuote.appeared_at} </p>
            <p> {props.objQuote.tags} </p> 
            <a href={props.objQuote._embedded.source[0].url}> source </a>
            <div>
                <Button className="button3" type="button" title="SAVE QUOTES" onClick={props.onClick} />
            </div>
            
            
            
        </>
    )}
   

     

  


export default CurrentQuote