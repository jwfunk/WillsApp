import { post,get,del } from 'aws-amplify/api';
import { useState,useEffect } from 'react'
import {  useSearchParams } from "react-router-dom";
import {  Marker,Popup } from 'react-leaflet'
import YouTube from 'react-youtube';

const redIcon = new L.Icon({                                                                     iconUrl: 'marker-icon-red.png',                                                              iconRetinaUrl: 'marker-icon-2x-red.png',                                                     iconAnchor: [12,41],                                                                         popupAnchor: [1,-34],                                                                        shadowUrl: 'marker-shadow.png',                                                              shadowSize: [41,41],                                                                         iconSize: [25,41],                                                                       });

export function UserVideos({user,update,setUpdate}){
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
        if(user.username != 'none'){
        return videos === null ? null : (<div>{videos.map(a => (<Marker icon={redIcon} position={[a.lat,a.lon]}><Popup maxWidth={500}><div style={{width:"500px"}}><button onClick={() => {deleteLink(a.url,user.username,setUpdate)}}>Remove</button><YouTube opts={{width:"100%"}} videoId={a.url}/></div></Popup></Marker>))}</div>)
        }else{
                                                                                                     return videos === null ? null : (<div>{videos.map(a => (<Marker icon={redIcon} position={[a.lat,a.lon]}><Popup maxWidth={500}><div style={{width:"500px"}}><YouTube opts={{width:"100%"}} videoId={a.url}/></div></Popup></Marker>))}</div>)
        }
}

export async function getVideos(user,setVideos){
  try {
    const restOperation = get({
      apiName: 'YTLink',
      path: '/YTLink/' + user
    });
    const response = await restOperation.response;
    const { body } = await restOperation.response;
          const json = await body.json();
    console.log('GET call succeeded: ', response);
          setVideos(json)
  } catch (e) {
    console.log('GET call failed: ', e);
}
}

export async function postLink(url,lat,lon,username,setUpdate) {                                      try {                                                                                          const restOperation = post({                                                                   apiName: 'YTLink',                                                                           path: '/YTLink',                                                                             options: {                                                                                     body: {                                                                                        url: url,                                                                                    lat: lat,                                                                                    lon: lon,                                                                                    user: username                                                                             }                                                                                          }                                                                                          });                                                                                      
    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('POST call succeeded');
    console.log(response);
    setUpdate(response)
  } catch (e) {
    console.log('POST call failed: ', e);
  }
}

export async function deleteLink(url,user,setUpdate) {
  try {
    const restOperation = del({
      apiName: 'YTLink',
      path: '/YTLink/object/' + user + '/' + url,
    });
    const response = await restOperation.response;
    console.log('DELETE call succeeded');
    setUpdate(response)
  } catch (e) {
    console.log('DELETE call failed: ', JSON.parse(e.response.body));
  }
}





