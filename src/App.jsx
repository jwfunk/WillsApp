import {useRef, useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SimpleParallax from "simple-parallax-js";
import { useMapEvents, Marker,MapContainer, TileLayer, useMap, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Amplify } from 'aws-amplify';
import { Authenticator,Menu,MenuItem } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { FileUploader ,StorageImage} from '@aws-amplify/ui-react-storage';
import { getUrl, list, remove } from 'aws-amplify/storage';
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
function Link({path,u}){
	const [l, setL] = useState(null);
	async function getLink(){
	const link = await getUrl({path:path})
	console.log(link.url)
	setL(link.url.href)
	}
	getLink()
	if(u){
	return (<>
		<a href = {l}><StorageImage path = {path} /></a>
		<button onClick={() => {Remove(path)}}>Remove</button>
		</>) 
	}
	else{
	return (<a href = {l}><StorageImage path = {path} /></a>) 
}}
async function Remove(path){
	await remove({path: path})
	console.log("removed " + path)
}
function UserImages({user,update,setBounds}){
	const [data, setData] = useState(null);
	const path = 'public/' + user.username + '/'
	const [searchParams, setSearchParams] = useSearchParams();
	const url = 'https://willsapp9f2fe81319484cdd95064882e08262c2c8a09-dev.s3.us-east-2.amazonaws.com/'
	useEffect(() => {
	async function getData() {
        const result = await list({path: (searchParams.get("user") === null ? path : 'public/' + searchParams.get("user") + '/')});
		console.log(result)
		if(!data){
			var top = result.items[0].path.split('/')[2];
			var bot = result.items[0].path.split('/')[2];
			var r = result.items[0].path.split('/')[3];
			var l  = result.items[0].path.split('/')[3];
			console.log(result.items)
			for(let i = 1;i < result.items.length; i++){
				if(result.items[i].path.split('/')[2] > top){
					top = result.items[i].path.split('/')[2]
				}
				if(result.items[i].path.split('/')[2] < bot){
					bot = result.items[i].path.split('/')[2]
				}
				if(result.items[i].path.split('/')[3] > r){
					r = result.items[i].path.split('/')[3]
				}
				if(result.items[i].path.split('/')[3] < l){
					l = result.items[i].path.split('/')[3]
				}
			}
				setBounds([[top,r],[bot,l]])
		}
	        setData(result)
	}
	if(!data || update != null) {
	getData()
	}
	},[update]);
	return data === null ? null : (<div>{data.items.map(a => (<Marker position={[a.path.split('/')[2],a.path.split('/')[3]]}><Popup><div style={{width:"300px"}}><Link path={a.path} u = {(searchParams.get("user") == null)}/></div></Popup></Marker>))}</div>)
}
import axios from "axios";
const Center = () => {
  const [position, setPosition] = useState({
    lat: 42.,
    lng: -90,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      },
      (blocked) => {
        if (blocked) {
          const fetch = async () => {
            try {
              const { data } = await axios.get("https://ipapi.co/json");
              setPosition({ lat: data.latitude, lng: data.longitude });
            } catch (err) {
              console.error(err);
            }
          };
          fetch();
        }
      }
    );
  }, []);
  return { position };
};
function App() {
	const [map,setMap] = useState(null)
	const [bounds,setBounds] = useState(null)
	const[update,setUpdate] = useState(null);	
	const [searchParams, setSearchParams] = useSearchParams();
	Amplify.configure(config);
	const { position } = Center();
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
	<MapContainer style={{height: "100vh", width: "100vw"}}center={position} zoom={5} scrollWheelZoom={true} ref={setMap}>
	  <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
	  <LocationMarker user = {user} setUpdate={setUpdate}/>
		    <UserImages user = {user} update={update} setBounds={setBounds}/>
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
