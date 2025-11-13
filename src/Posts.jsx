import { post,get,del } from 'aws-amplify/api';
import { useState,useEffect } from 'react'
import {  useSearchParams } from "react-router-dom";
import {  Marker,Popup } from 'react-leaflet'
import {Link} from 'react-router-dom'

const yellowIcon = new L.Icon({                                                                     iconUrl: 'marker-icon-gold.png',                                                              iconRetinaUrl: 'marker-icon-2x-gold.png',                                                     iconAnchor: [12,41],                                                                         popupAnchor: [1,-34],                                                                        shadowUrl: 'marker-shadow.png',                                                              shadowSize: [41,41],                                                                         iconSize: [25,41],                                                                       });

export function UserPosts({user,update,setUpdate}){
        const [posts, setPosts] = useState(null);
        const [searchParams, setSearchParams] = useSearchParams();

        useEffect(() => {
                if(update != null){
                        console.log(update)
                        getPosts(user,setPosts);
                        setUpdate(null)
                }
                if(posts == null){getPosts(user,setPosts);}
                else{
                console.log(posts)}},[user,posts,update])
        if(user != 'none'){
        return posts === null ? null : (<div>{posts.map(a => (<Marker icon={yellowIcon} position={[a.lat,a.lon]}><Popup maxWidth={500}><div style={{width:"500px"}}><Link to={'/post/edit/' + user + '/' + a.id}>Post</Link><button onClick={() => {deletePost(a.id,user,setUpdate)}}>Remove</button></div></Popup></Marker>))}</div>)
        }else{
                                                                                                     return posts === null ? null : (<div>{videos.map(a => (<Marker icon={yellowIcon} position={[a.lat,a.lon]}><Popup maxWidth={500}><div style={{width:"500px"}}></div></Popup></Marker>))}</div>)
        }
}

export async function getPosts(user,setPosts){
  try {
    const restOperation = get({
      apiName: 'Posts',
      path: '/post/' + user
    });
    const response = await restOperation.response;
    const { body } = await restOperation.response;
          const json = await body.json();
    console.log('GET call succeeded: ', response);
          setPosts(json)
  } catch (e) {
    console.log('GET call failed: ', e);
}
}

export async function getPost(setPost,user,id){
  try {
    const restOperation = get({
      apiName: 'Posts',
      path: '/post/object/' + user + '/' + id
    });
    const response = await restOperation.response;
    const { body } = await restOperation.response;
          const json = await body.json();
    console.log('GET call succeeded: ', response);
	  console.log(json)
          setPost(json)
  } catch (e) {
    console.log('GET call failed: ', e);
}
}
export async function postPost(id,lat,lon,user,setUpdate,username) {                                      try {
	const restOperation = post({                                                                   
		apiName: 'Posts',                                                                           
		path: '/post',                                                                             
		options: {                                                                                     
			body: {                                             
				id: id.toString().replace('.','').replace('.',''),     
				lat: lat,
				lon: lon,                                          
				user: user,
				published: false,
				username: username
           }                                                                                          }                                                                                          });                                                                                      
    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('POST call succeeded');
    console.log(response);
    setUpdate(response)
  } catch (e) {
    console.log('POST call failed: ', e);
  }
}

export async function deletePost(id,user,setUpdate) {
  try {
    const restOperation = del({
      apiName: 'Posts',
      path: '/post/object/' + user + '/' + id,
    });
    const response = await restOperation.response;
    console.log('DELETE call succeeded');
    setUpdate(response)
  } catch (e) {
    console.log('DELETE call failed: ', JSON.parse(e.response.body));
  }
}





