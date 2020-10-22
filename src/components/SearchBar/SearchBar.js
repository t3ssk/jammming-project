import React from 'react'
import './SearchBar.css'

export class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.getTerm = this.getTerm.bind(this)
        this.getSearchResult = this.getSearchResult.bind(this)
        this.state = {term: ""}
    }  
    
    getTerm(e){
        let newTerm = e.target.value
        this.setState({term: newTerm})
    }
    getSearchResult(){
        
        this.props.onSearch(this.state.term)
    }
    render(){
        return (<div className="SearchBar">
                    <input placeholder="Enter A Song, Album, or Artist" onChange={this.getTerm}/>
                    <button className="SearchButton" onClick={this.getSearchResult}>SEARCH</button>
                </div>
                )

    }

}