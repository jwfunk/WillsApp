import {useRef, useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SimpleParallax from "simple-parallax-js";
import { useMapEvents, Marker,MapContainer, TileLayer, useMap, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import data from './data.json';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { list } from 'aws-amplify/storage';
function OpenMarker({user,position}) {
	const markerRef = useRef(null);
  const processFile = ({ file, key }) => {
  return {
    file,
    key,
    metadata: {
      pos: position
    },
  };
};
useEffect(() => {
	    markerRef.current.openPopup();
  }, [position]);

return (
    <Marker position={position} ref={markerRef}>
      <Popup>
	  <FileUploader
      acceptedFileTypes={['image/*']}
      path={'public/' + user.username + '/'}
      maxFileCount={1}
      isResumable
      processFile={processFile}
    />
	  </Popup>
	</Marker>)
}
function LocationMarker(user) {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      //map.flyTo(e.latlng, map.getZoom())
    },
  })
  return position === null ? null : (
    <OpenMarker position = {position} user = {user}>
    </OpenMarker>
  )
}
function UserImages(user){
	const [data, setData] = useState('');
	const path = 'public/' + user.username + '/'
	useEffect(() => {
	async function getData() {
        const result = await list({path: path});
	setData(result)
	}
	if(!data) {
	getData()
	}
	},[]);
	return <div>data</div>
}
function App() {
	
	Amplify.configure(config);
	console.log(data)
	console.log(data.pictures)
  const [count, setCount] = useState(0)
	  const position = [42.862112, -89.539215]
  return (
	  <>
	<Authenticator>
            {({ signOut, user }) => (
                <div>
		    <UserImages {...user} />
                    <p>Welcome {user.username}</p>
                    <button onClick={signOut}>Sign out</button>
	  <div style={{width: "100vw", height: "100vh"}}>
	<MapContainer style={{height: "100vh", width: "100vw"}}center={position} zoom={13} scrollWheelZoom={true}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
	  <LocationMarker {...user} />
	{data.pictures.map(a =>( <Marker position = {a.position}><Popup style={{width:"300px"}}><a href={a.picture}><img  style={{width:"300px"}} key={a.picture} src={a.picture} /></a></Popup></Marker>))}
</MapContainer>
	  </div>
                </div>
            )}
        </Authenticator>
	  </>
  )
}

export default App
