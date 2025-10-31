import {useRef, useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SimpleParallax from "simple-parallax-js";
import { useMapEvents, Marker,MapContainer, TileLayer, useMap, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { FileUploader ,StorageImage} from '@aws-amplify/ui-react-storage';
import { list } from 'aws-amplify/storage';
import {  useSearchParams } from "react-router-dom";
function OpenMarker({user,position,setUpdate}) {
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

return (
    <Marker position={position} ref={markerRef}>
      <Popup>
	  <FileUploader onUploadSuccess = {setUpdate}
      acceptedFileTypes={['image/*']}
      path={'public/' + user.username + '/' + position.lat + '/' + position.lng + '/'}
      maxFileCount={1}
      isResumable
      processFile={processFile}
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
function UserImages({user,update}){
	const [data, setData] = useState(null);
	const path = 'public/' + user.username + '/'
	const [searchParams, setSearchParams] = useSearchParams();
	const url = 'https://willsapp9f2fe81319484cdd95064882e08262c2c8a09-dev.s3.us-east-2.amazonaws.com/'
	useEffect(() => {
	async function getData() {
        const result = await list({path: (searchParams.get("user") === null ? path : 'public/' + searchParams.get("user") + '/')});
		console.log(result)
	setData(result)
	}
	if(!data || update != null) {
	getData()
	}
	},[update]);
	return data === null ? null : (<div>{data.items.map(a => (<Marker position={[a.path.split('/')[2],a.path.split('/')[3]]}><Popup><div style={{width:"300px"}}><StorageImage path = {a.path} /></div></Popup></Marker>))}</div>)
}
function App() {
	const[update,setUpdate] = useState(null);	
	const [searchParams, setSearchParams] = useSearchParams();
	Amplify.configure(config);
  const [count, setCount] = useState(0)
	  const position = [42.862112, -89.539215]
	if(searchParams.get("user") == null){
  return (
	  <>
	<Authenticator>
            {({ signOut, user }) => (
                <div>
                    <p>Your link is {window.location.href}?user={user.username}</p>
                    <button onClick={signOut}>Sign out</button>
	  <div style={{width: "100vw", height: "100vh"}}>
	<MapContainer style={{height: "100vh", width: "100vw"}}center={position} zoom={13} scrollWheelZoom={true}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
	  <LocationMarker user = {user} setUpdate={setUpdate}/>
		    <UserImages user = {user} update={update}/>
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
	<MapContainer style={{height: "100vh", width: "100vw"}}center={position} zoom={13} scrollWheelZoom={true}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
	  <LocationMarker user = {user} setUpdate={setUpdate}/>
		    <UserImages user = {user} update={update}/>
</MapContainer>
	  </div>
                </div>

	)
  }
}

export default App
