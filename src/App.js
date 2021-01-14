import React from 'react';
import './App.css';
import LogoImg from "./components/LogoImg";
import Button from "./components/Button";
import TagList from "./components/TagList";
import CurrentQuote from "./components/CurrentQuote"


// TODO:
// FACILE
// 1) dividere i componenti in file diversi --DONE
// 2) this.state.currentQuote
//    creare un componente che visualizzi, oltre che la citazione stessa, anche:
//    - lista di tag associati alla citazione (array "tags") -- DONE
//    - data della citazione (appeared_at) --DONE
//    - link alla fonte della citazione (investigare nella chiave "_embedded",--DONE
//      prendete sempre il primo elemento dell'array "source") --DONE
// 3) gestione carina ed appropriata degli errori (this.state.error) -- DONE
// 4) modalità lista, visualizzare le citazioni associate al tag selezionato--DONE
//    (utilizzando il componente creato nel punto 2) 
//    (fatelo comportare in maniera diversa a seconda della modalità random/list)
// 5) tornando alla modalità random, deselezionare il tag selezionato --DONE
// medio/difficile
// 6) arricchire il componente creato nel punto 2 con un meccanismo di salvataggio (solo in modalità random) - CONTROLLARE CHE LA CITAZIONE NON SIA STATA GIA' SALVATA (quote_id) --DONE
// 7) arricchire il componente creato nel punto 2 con un meccanismo di cancellazione (solo in modalità lista)
//    (utilizzate il campo "quote_id" all'interno della citazione)
// 8) trasforma tutto in componenti funzionali


const RANDOMURL = 'https://api.tronalddump.io/random/quote'
// const SEARCHURL = 'https://api.tronalddump.io/search/quote'
// const ALLTAGSURL = 'https://api.tronalddump.io/tag'


class App extends React.Component {
  constructor(props) {
    super(props); // il metodo super si inizializza sempre
    this.state = {
      loading: false,
      error: false,
      currentQuote: {}, //dato da visualizzare, fino a quando non clicco sul pulsante non ho nulla da visualizzare quindi variabile è oggetto vuoto
      quotesToShow: [], 
      // getting storage string with key 'trumpQuotes' and parsing it (if exists)
      storedQuotes: ((JSON.parse(localStorage.getItem('trumpQuotes'))) !== null 
      ? (JSON.parse(localStorage.getItem('trumpQuotes'))) 
      : []),
      storedTags: ((JSON.parse(localStorage.getItem('trumpQuotesTags'))) !== null 
      ? (JSON.parse(localStorage.getItem('trumpQuotesTags'))) : []),
      selectedTag: '',
      isListMode: false,

    }
  }



  // dividere in fetchRandomTrump() e saveRandomTrump()
  fetchRandomTrump = async () => {
    let quote = {}
    let error = false

    try {
      this.setState({ loading: true })
      let response = await fetch(RANDOMURL)
      let data = await response.json()
      // console.log('NEL TRY DATA: ', data)
      // promise is still resolved even if no quotes got fetched (example: wrong url)
      // need to handle this situation manually
      // throw new Error blocks the execution, and jumps directly into 'CATCH'
      if (data.error) throw new Error(data.error)
      

      quote = {...data} //è l'oggetto che contiene il risultato
      console.log("aaaaaaa", data.error)

    } catch (err) {
      console.log('SONO NEL CATCH: ', err)
      error = true
      this.setState({...this.state, error: error}) 
      console.log( "eccomi!",this.state.error) 
      
    } finally { 
      localStorage.setItem('trumpCurrentQuote', JSON.stringify(quote))
      this.setState({...this.state, // see immutables
          currentQuote: error ? {} : quote,
          loading: false,
          error //SINTASSI ABBREVIATA DI error:error
        })
    }
  
  }
  saveRandomTrump = ()=> {
  const storedQuotes=this.state.storedQuotes 
  let storedTags = this.state.storedTags 
  // see inside quote.tags.forEach
  // let storedTags = [...this.state.storedTags]
  let isNewQuote = true


  // avoid condition if array is empty
  if (storedQuotes.length > 0) {
    // check if quote already exists
      const indexQuote = storedQuotes.findIndex(storedQuote => this.state.currentQuote.quote_id === storedQuote.quote_id)
      if (indexQuote > -1 ) { // this means that quote already exists!
        isNewQuote = false
      } 
  } 
  // checking stored tags
  // checking for each retrieved tag, if exists
  if (this.state.currentQuote.tags.length > 0) {
      this.state.currentQuote.tags.forEach(currentTag => {
            const indexTag = storedTags.findIndex(storedTag => storedTag === currentTag)
            if (indexTag === -1) {
              // mutable operation will lead to bugs here
              // storedTags.push(currentTag)
              storedTags = [...storedTags, currentTag]
            }
          })
  } 
  // using setState with prevState
  // see https://css-tricks.com/understanding-react-setstate/
  this.setState((prevState) => {
    const quotesToSave = isNewQuote ? [...prevState.storedQuotes,this.state.currentQuote] : prevState.storedQuotes
    // storing into localStoragequ
    localStorage.setItem('trumpQuotes', JSON.stringify(quotesToSave))
    localStorage.setItem('trumpQuotesTags', JSON.stringify(storedTags))
   
    return{
      ...this.state,
      storedQuotes: [...quotesToSave],
      storedTags: [...storedTags],
    }
  })
}




  onTagClick = (event) => {
    
    this.setState({ selectedTag: event.target.name});
    const filterQuotes= this.state.storedQuotes.filter(singleQuote => singleQuote.tags.findIndex(tag => tag === event.target.name) > -1)
    console.log("hai filtrato?", filterQuotes)
    this.setState({quotesToShow: filterQuotes}, () => {
        console.log("le citazioni per tag sono: ", this.state.quotesToShow)
    })

  }
  removeQuote = (event) => {
    console.log("funziono!", this.state.quotesToShow, "lunghezza:", this.state.quotesToShow.length, "cit da rimuovere:", event)
    //verifico

    let index = this.state.quotesToShow.indexOf(event)
    if (index >-1) {this.state.quotesToShow.splice(index, 1)}
    this.setState({quotesToShow: this.state.quotesToShow})
    console.log("nuovo array:", this.state.quotesToShow.length)

    let cit =this.state.storedQuotes.findIndex(id=> id.quote_id===event.quote_id)

    if (cit >-1) {this.state.storedQuotes.splice(cit,1)}
    this.setState({storedQuotes: this.state.storedQuotes})
   


  }

  onModeClick = (mode) => (event) => {
    console.log('MODE? ', mode)
    this.setState({ isListMode: mode=== 'list' ? true : false })
    if (!this.state.isListMode) this.setState({selectedTag: ""})
  } 

  componentDidUpdate(prevProps, prevState) {
    // console.log('PROBLEM!!! ', prevState.storedTags.length, this.state.storedTags.length)
    if (prevState.storedTags.length !== this.state.storedTags.length) console.log('DIFFERENZA STOREDTAG!')
  }

  render () { 
    /* console.log("lo state è", this.state)
    console.log ("i tag salvati sono", this.state.storedTags)*/
     /* console.log("le citazioni salvate sono", this.state.storedQuotes)  */
    /*console.log("tag selezionato", this.state.selectedTag ) */ 
    /* console.log("ci sei", this.state.currentQuote) */
    
    return (
      <div className="App">
        <header className="App-header">
          {/* aggiungo classe css a logo in base allo stato */}
          <LogoImg className={`App-logo${this.state.loading ? " App-logo-spinning" : ""}`}/>
          <div>
            <Button className="button1" type="button" title="RANDOM MODE" onClick={this.onModeClick('random')} isDisabled={!this.state.isListMode}/>
            <Button className="button1" type="button" title="LIST MODE"  onClick={this.onModeClick('list')} isDisabled={this.state.isListMode}/> 
          </div>
        </header>
        <section className="App-section">
          {this.state.isListMode 
          ? ( <>
            <TagList
              storedTags={this.state.storedTags}
              onTagClick={this.onTagClick}
              selectedTag={this.state.selectedTag}
           />

            {this.state.selectedTag !== "" && this.state.quotesToShow.map((singleQuote, key) =>
            <div key={key}> 
              <CurrentQuote  isListMode={this.state.isListMode} objQuote={singleQuote}/>
              <div>
                <Button className="button3" type="button" title="REMOVE!"  onClick={() => this.removeQuote(singleQuote)}/>
              </div>   
           </div>
            )}
          </>) 

          : (<> 
            <div>
              <Button className="button2" type="button" title={this.state.loading ? 'loading...' : 'RANDOM TRUMP QUOTE'} onClick={this.fetchRandomTrump} isDisabled={this.state.loading}/>     
            </div>
            {this.state.error === true 
              ? <><p className="error"> Ops, qualcosa è andato storto! ☹️ </p>
                </>

              : Object.keys(this.state.currentQuote).length > 0 
              && <>
                <CurrentQuote isListMode={this.state.isListMode} objQuote={this.state.currentQuote}/>
                <div>
                  <Button className="button3" type="button" title="SAVE QUOTES" onClick={this.saveRandomTrump}/>
                </div>
                
              </>
            }
            </>)
          }
          

          <p>Citazioni salvate: {this.state.storedQuotes.length}</p>
         
          <p>Tag salvati: {this.state.storedTags.length}</p>
        </section>
      </div>
    );
  }
}

export default App;


// mutable / immutable useful links:
// https://stackoverflow.com/questions/48057906/prevstate-in-componentdidupdate-is-the-currentstate#48058492
// https://ultimatecourses.com/blog/all-about-immutable-arrays-and-objects-in-javascript#immutable-object-operations

// OTHER USEFUL LINKS:
// https://www.taniarascia.com/understanding-destructuring-rest-spread/
// https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
