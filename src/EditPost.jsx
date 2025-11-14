import {  useParams,Navigate } from "react-router-dom";
import {getPost} from './Posts.jsx'
import { useState,useEffect } from 'react'
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import { Authenticator,Menu,MenuItem } from '@aws-amplify/ui-react';
import ReactQuill,{Quill} from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'
import {uploadData} from "@aws-amplify/storage";
import { fetchAuthSession } from 'aws-amplify/auth'
import {getUrl, downloadData } from 'aws-amplify/storage';
import ImageResize from 'quill-image-resize-module-react';
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
	const result = await uploadData({
		path:'protected/' + session.identityId + '/' + id + '/' + 'post.html',
		data: blob
	}).result
	console.log(result)
}
catch(e){
console.log(e)
}
}

const loadPost = async (id,puser,setContent) => {
try{
	const downloadResult = await getUrl({
    path: "protected/" + puser + '/' + id + '/post.html'
  });
	console.log(downloadResult)
  fetch(downloadResult.url).then((res) => res.blob()).then((blob) => blob.text()).then((text) => (setContent(text)))
}
catch(e){
console.log(e)
}
}

function EditPost(){
	Amplify.configure(config);
const[post,setPost] = useState(null);
const {id} = useParams()
const {puser} = useParams()
	const [content, setContent] = useState('');
	
	useEffect(() => {
	Quill.register('modules/imageResize', ImageResize);
		getPost(setPost,puser,id)
		loadPost(id,puser,setContent)
	},[])

  const handleContentChange = (value) => {
    setContent(value);
  };


const modules = {
  toolbar: [
	[{ 'header': [1, 2, 3, 4, 5, 6, false] },{ 'font': [] },{ 'align': [] }],
    ['bold', 'italic', 'underline','strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image','video'],[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  
  
  ],
	imageResize: {
parchment: Quill.import('parchment'),
modules: ['Resize', 'DisplaySize']
}
};

if(post == null){return null}
	else {
		return(
		<>
		<Authenticator> 
		{({signOut,user}) => (user.username === post.username.toString() ? (
			<>
			<ReactQuill theme="snow" value={content} onChange={handleContentChange} modules={modules}/>
			<button onClick={() => (uploadFile(content,id))}>Save Post</button>
			</>
		) : (<Navigate to={'/post/' + id}/>))}
		</Authenticator>
			</>
	)}
}

export default EditPost
