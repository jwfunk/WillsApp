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
import { post,get } from 'aws-amplify/api';
import YouTube from 'react-youtube';
import L from 'leaflet';
import { del } from 'aws-amplify/api';
const redIcon = new L.Icon({
    iconUrl: 'marker-icon-red.png',
    iconRetinaUrl: 'marker-icon-2x-red.png',
    iconAnchor: [12,41],
    popupAnchor: [1,-34],
    shadowUrl: 'marker-shadow.png',
    shadowSize: [41,41],
    iconSize: [25,41],
});

async function getVideos(user,setVideos){
  try {
    const restOperation = get({ 
      apiName: 'YTLink',
      path: '/YTLink' 
    });
    const response = await restOperation.response;
    const { body } = await restOperation.response;
	  const json = await body.json();
    console.log('GET call succeeded: ', response);
	  setVideos(json)
  } catch (e) {
    console.log('GET call failed: ', JSON.parse(e.response.body));
}
}
async function postLink(url,lat,lon,username,setUpdate) {
  try {
    const restOperation = post({
      apiName: 'YTLink',
      path: '/YTLink',
      options: {
        body: {
          url: url,
	  lat: lat,
	  lon: lon,
	  user: username
        }
      }
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('POST call succeeded');
    console.log(response);
    setUpdate(response)
  } catch (e) {
    console.log('POST call failed: ', JSON.parse(e.response.body));
  }
}

async function deleteLink(url,user,setUpdate) {
  try {
    const restOperation = del({
      apiName: 'YTLink',
      path: '/YTLink/object/' + url + '/' + user,
    });
    const response = await restOperation.response;
    console.log('DELETE call succeeded');
    setUpdate(response)
  } catch (e) {
    console.log('DELETE call failed: ', JSON.parse(e.response.body));
  }
}

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
	<input ref={inputRef} /><button onClick={() => {postLink(inputRef.current.value.split('?v=')[1],position.lat,position.lng,user.username,setUpdate)}}/>
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
function Link({path,u,setUpdate}){
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
		<button onClick={() => {Remove(path,setUpdate)}}>Remove</button>
		</>) 
	}
	else{
	return (<a href = {l}><StorageImage path = {path} /></a>) 
}}
async function Remove(path,setUpdate){
	await remove({path: path})
	setUpdate("removed " + path)
}
function UserVideos({user,update,setUpdate}){
	const path = 'public/' + user.username + '/'
	const [videos, setVideos] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	
	useEffect(() => {
		if(update != null){
			console.log(update)
			getVideos(user.username,setVideos);
			setUpdate(null)
		}
		if(videos == null){getVideos(user.username,setVideos);}
		else{
		console.log(videos)}},[videos,update])
	return videos === null ? null : (<div>{videos.map(a => (<Marker icon={redIcon} position={[a.lat,a.lon]}><Popup maxWidth={500}><div style={{width:"500px"}}><button onClick={() => {deleteLink(a.url,user.username,setUpdate)}}/><YouTube opts={{width:"100%"}} videoId={a.url}/></div></Popup></Marker>))}</div>)	
	
}
function UserImages({user,update,setBounds,setUpdate}){
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
	return data === null ? null : (<div>{data.items.map(a => (<Marker position={[a.path.split('/')[2],a.path.split('/')[3]]}><Popup><div style={{width:"300px"}}><Link path={a.path} u = {(searchParams.get("user") == null)} setUpdate={setUpdate}/></div></Popup></Marker>))}</div>)
}
import axios from "axios";

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
