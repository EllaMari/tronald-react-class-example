import React from "react";
import Button from "./Button";

const CurrentQuote = (props) => { 

    
    /* if (props && props.objQuote && props.objQuote._embedded && props.objQuote._embedded.source && props.objQuote._embedded.source.length >0 ) console.log("aaaaa", props.objQuote._embedded.source[0].url) */ 
    console.log("aaa:", props.isListMode)
    console.log(" type", typeof props.objQuote.appeared_at)
    let date = new Date(props.objQuote.appeared_at)
    return    props.isListMode 
    ? (<> 
        <q> {props.objQuote.value } </q>
        <Button className="button3" type="button" title="REMOVE!" onClick={props.onClick}/> </>)
    : (
        <>
            <q> {props.objQuote.value } </q>
            <p> {date.toDateString()} </p>
            <p> Tag correlati: <b>{props.objQuote.tags} </b></p> 
            <a href={props.objQuote._embedded.source[0].url} target="_blank"> source </a>
            <div>
                <Button className="button3" type="button" title="SAVE QUOTES" onClick={props.onClick} />
            </div>
            
            
            
        </>
    )}
   

     

  


export default CurrentQuote