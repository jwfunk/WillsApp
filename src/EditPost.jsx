import {  useParams,Navigate } from "react-router-dom";
import {getPost} from './Posts.jsx'
import { useState,useEffect } from 'react'
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import { Authenticator,Menu,MenuItem } from '@aws-amplify/ui-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'
import {uploadData} from "@aws-amplify/storage";
import { fetchAuthSession } from 'aws-amplify/auth'
function uploadFile(content,id) {
	const blob = new Blob([content],{type: "text/plain"})
	send(blob,id)
	const url = URL.createObjectURL(blob)
	const link = document.createElement("a");
  link.download = "user-info.json";
  link.href = url;
  //link.click();
}

const send = async (blob,id) => {
try{
	const session = await fetchAuthSession()
	console.log(session.identityId)
	uploadData({
		path:'protected/' + session.identityId + '/' + id + '/' + 'post.html',
		data: blob
	})
}
catch(e){

}
}

function EditPost(){
	Amplify.configure(config);
const[post,setPost] = useState(null);
const {id} = useParams()
const {puser} = useParams()
	useEffect(() => {
getPost(setPost,puser,id)},[])
	const [content, setContent] = useState('');

  const handleContentChange = (value) => {
    setContent(value);
  };
if(post == null){return null}
	else {
		return(
		<>
		<Authenticator> 
		{({signOut,user}) => (user.username === post.user.toString() ? (
			<>
			<ReactQuill theme="snow" value={content} onChange={handleContentChange}/>
			<div dangerouslySetInnerHTML = {{__html: content}}/>
			<button onClick={() => (uploadFile(content,id))}/>
			</>
		) : (<Navigate to={'/post/' + id}/>))}
		</Authenticator>
			</>
	)}
}

export default EditPost
