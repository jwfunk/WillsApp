import {useRef, useState, useEffect } from 'react'
import './App.css'
import { useMapEvents, MapContainer, TileLayer, useMap,Marker,Popup  } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Amplify } from 'aws-amplify';
import { Authenticator,Menu,MenuItem } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { FileUploader ,StorageImage} from '@aws-amplify/ui-react-storage';
import {  useSearchParams } from "react-router-dom";
import L from 'leaflet';
import {UserVideos,deleteLink,postLink,getVideos} from './Videos.jsx'
import {UserPosts,deletePost,postPost,getPosts} from './Posts.jsx'
import {Link,Remove,UserImages} from './Images.jsx'

function OpenMarker({user,position,setUpdate}) {
	/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
	const markerRef = useRef(null);
	const [upload,setUpload] = useState(null);

	const processFile = ({ file, key }) => {
	setUpload(position);  
  return {
    file,
    key,
    metadata: {
      pos: position
    },
  };
};
useEffect(() => {
	if(searchParams.get("user") == null){
	if (position != null && upload == position){
	    markerRef.current.closePopup();
	}
	else{
	    markerRef.current.openPopup();
	}}
  }, [position,upload]);
	const [searchParams, setSearchParams] = useSearchParams();
if(searchParams.get("user") == null){
	const inputRef = useRef(null);
return (
    <Marker position={position} ref={markerRef}>
      <Popup>
	<input ref={inputRef} /><button onClick={() => {postLink(inputRef.current.value.split('?v=')[1],position.lat,position.lng,user.username,setUpdate)}}>Add Video</button><button onClick={() => {postPost(user.username + position.lat + position.lng,position.lat,position.lng,user.username,setUpdate)}}>Add Post</button>
	  <FileUploader onUploadSuccess = {setUpdate}
      acceptedFileTypes={['image/*']}
      path={'public/' + user.username + '/' + position.lat + '/' + position.lng + '/'}
      maxFileCount={1}
      isResumable
      processFile={processFile}
      components={{FileList({files,onCancelUpload,onDeleteUpload}){
	return (<div></div>)
      }}}
    />
	  </Popup>
	</Marker>)}
else{
	return null
}
}
function LocationMarker({user,setUpdate}) {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      //map.flyTo(e.latlng, map.getZoom())
    },
  })
  return position === null ? null : (
    <OpenMarker position = {position} user = {user} setUpdate={setUpdate}>
    </OpenMarker>
  )
}

function App() {
	const [map,setMap] = useState(null)
	const [bounds,setBounds] = useState(null)
	const[update,setUpdate] = useState(null);	
	const [searchParams, setSearchParams] = useSearchParams();
	Amplify.configure(config);
	  const [position, setPosition] = useState({
    lat: 42.,
    lng: -90,
  });
	useEffect(() => {if(map != null){map.fitBounds(bounds)}},[bounds])
	if(searchParams.get("user") == null){
  return (
	  <>
	<Authenticator>
            {({ signOut, user }) => (
                <div>
		    <Menu menuAlign="end" size="Large">
		    <MenuItem><button onClick={signOut}>Sign out</button></MenuItem>
		    <MenuItem><button onClick={() => {navigator.clipboard.writeText(window.location.href + '?user=' + user.username)}}>Copy Share Link</button></MenuItem>
                    
		    </Menu>
	  <div style={{width: "100vw", height: "100vh"}}>
	<MapContainer style={{height: "100vh", width: "100vw"}}center={position} zoom={13} scrollWheelZoom={true} ref={setMap}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
	  <LocationMarker user = {user} setUpdate={setUpdate}/>
		    <UserImages user = {user} update={update} setBounds={setBounds} setUpdate={setUpdate}/>
		    <UserVideos user = {user} update={update} setUpdate={setUpdate}/>
		    <UserPosts user = {user} update={update} setUpdate={setUpdate}/>
</MapContainer>
	  </div>
                </div>
            )}
        </Authenticator>
	  </>
  )}
  else{
	  const user = {username:"none"}
	return(
                <div>
	  <div style={{width: "100vw", height: "100vh"}}>
	<MapContainer style={{height: "100vh", width: "100vw"}}center={position} zoom={13} scrollWheelZoom={true}ref={setMap}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
		    <UserImages user = {user} update={update} setBounds={setBounds} setUpdate={setUpdate}/>
		    <UserVideos user = {user} update={update} setUpdate={setUpdate}/>
</MapContainer>
	  </div>
                </div>

	)
  }
}

export default App
