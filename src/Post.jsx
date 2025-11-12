import {  useParams } from "react-router-dom";
import {getPost} from './Posts.jsx'
import { useState,useEffect } from 'react'
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
function Post(){
	Amplify.configure(config);
const[post,setPost] = useState(null);
const {id} = useParams()
	useEffect(() => {
getPost(setPost,id)},[])
if(post == null){return null}
	else return(<p>{post[0].id.toString()}</p>)
}

export default Post
