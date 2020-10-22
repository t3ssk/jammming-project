import React from 'react';
import { SearchBar } from './components/SearchBar/SearchBar';
import { SearchResults } from './components/SearchResults/SearchResults';
import { PlayList } from './components/Playlist/Playlist';
import { Spotify } from './util/Spotify';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={searchResults: [],
    playListName: 'New playlist', 
    playListTracks: []};
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }
  addTrack(track){
    const tracks = this.state.playListTracks
    let foundTracks = this.state.searchResults
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return
    }
    else {
      tracks.push(track)
      foundTracks = foundTracks.filter(removeTrack=>{return removeTrack.id !== track.id});
      this.setState({
        searchResults: foundTracks,
        playListTracks: tracks});
      
    }
  }
  removeTrack(track){
    let tracks = this.state.playListTracks
    let foundTracks = this.state.searchResults
    tracks = tracks.filter(removeTrack=>{return removeTrack.id !== track.id})
    if(foundTracks.find(savedTrack => savedTrack.id === track.id)){
      return
    }
    else {
      foundTracks.push(track)
    }
    this.setState({searchResults: foundTracks,
                    playListTracks: tracks})
    
  }
  updatePlaylistName(newName){
      this.setState({playListName: newName})
  }
  savePlaylist(){
    const trackUris = this.state.playListTracks.map(track=> track.uri)
    console.log(trackUris)
      Spotify.savePlaylist(this.state.playListName, trackUris).then(()=>{
        this.setState({playListName: 'New Playlist',
        playListTracks: []})
      })
  }
  search(term){
      Spotify.search(term).then(searchResults => {this.setState({searchResults: searchResults})})
  }
  render(){
  return (
    <div>
     <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
       <SearchBar onSearch={this.search}/>
       <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
        <PlayList playListName={this.state.playListName} playListTracks={this.state.playListTracks} onRemove={this.removeTrack} onChangeName={this.updatePlaylistName} value={this.state.playListName} onSave={this.savePlaylist}/>
        </div>
      </div>
    </div>
  );}
}

export default App;
