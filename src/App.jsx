import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SimpleParallax from "simple-parallax-js";
import { Marker,MapContainer, TileLayer, useMap, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import data from './data.json'

function App() {
	console.log(data)
	console.log(data.pictures)
  const [count, setCount] = useState(0)
	  const position = [42.862112, -89.539215]

  return (
	  <>
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
