import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SimpleParallax from "simple-parallax-js";
import { Marker,MapContainer, TileLayer, useMap, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import data from './data.json';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
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
                    <p>Welcome {user.username}</p>
                    <button onClick={signOut}>Sign out</button>
                </div>
            )}
        </Authenticator>
	  <FileUploader
      acceptedFileTypes={['image/*']}
      path="public/"
      maxFileCount={1}
      isResumable
    />
	  <div style={{width: "100vw", height: "100vh"}}>
	<MapContainer style={{height: "100vh", width: "100vw"}}center={position} zoom={13} scrollWheelZoom={true}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
	{data.pictures.map(a =>( <Marker position = {a.position}><Popup style={{width:"300px"}}><a href={a.picture}><img  style={{width:"300px"}} key={a.picture} src={a.picture} /></a></Popup></Marker>))}
</MapContainer>
	  </div>
	  <div>
	  </div>
	  </>
  )
}

export default App
