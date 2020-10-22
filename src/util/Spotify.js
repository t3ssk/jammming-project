let userAccessToken
const clientID = '9971d60ab54a45ad9add570eb80b43f7';
const redirectUri = 'http://localhost:3000/';
const spotifyAPI = 'https://api.spotify.com/v1/'

export const Spotify = {
    
    getAccessToken(){
        if(userAccessToken !== undefined){
            return userAccessToken
        } 

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
        if (accessTokenMatch && expiresInMatch){
            userAccessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1])
            window.setTimeout(()=>userAccessToken="", expiresIn * 1000);
            window.history.pushState('Access Token', null, '/')
            return userAccessToken
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location.href = accessUrl
        }
    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(spotifyAPI + `search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}})
            .then((response)=>{
                    return response.json()   
            })
            .then((responseJson)=>{
                if(!responseJson.tracks){
                    return []
                } else {
                    return responseJson.tracks.items.map(track=> {return {
                        id: track.id, 
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }})
                }
            })
    },
    savePlaylist(name, trackUris){
        if(!name || !trackUris.length){return}
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userID
        return fetch(spotifyAPI + 'me', {headers: headers})
                        .then((response)=>{
                            return response.json()
                        })
                        .then((jsonResponse)=>{
                            userID = jsonResponse.id
                            return fetch(spotifyAPI + `users/${userID}/playlists`, {headers: headers, method: 'POST', body: JSON.stringify({name: name})})
                                        .then((response)=>{return response.json()})
                                        .then((jsonResponse)=>{const playlistID = jsonResponse.id
                                        
                                    return fetch(spotifyAPI + `/v1/users/${userID}/playlists/${playlistID}/tracks`, {headers: headers, method: 'POST', body: JSON.stringify({uris: trackUris})})})
                        })
    }
} 


