import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import egret from '/LightRoom/EgretVertical.jpg'
import SimpleParallax from "simple-parallax-js";
import { Marker,MapContainer, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";

function App() {
  const [count, setCount] = useState(0)
	  const position = [51.505, -0.09]

  return (
    <>
	  <div style={{width: "100%", height: "500px"}}>
	<MapContainer style={{height: "100%"}}center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
  <Marker position={[51.505, -0.09]}>
  </Marker>
</MapContainer>
	  </div>
	  <SimpleParallax overflow>
	  <img src={egret} style={{width: "100%"}}/>
	  </SimpleParallax>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
