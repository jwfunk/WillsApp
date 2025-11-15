import React from 'react';
import {  useParams,Navigate } from "react-router-dom";
import {getPost} from './Posts.jsx'
import { useRef,useState,useEffect } from 'react'
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

const genURL = async (url) => {
const downloadResult = await getUrl({
    path: url
  });
	const result = await downloadResult.url
	return result 
}

const loadPost = async (id,puser,setContent,value) => {
try{
	const downloadResult = await getUrl({
    path: "protected/" + puser + '/' + id + '/post.html'
  });
	console.log(downloadResult)
  fetch(downloadResult.url).then((res) => res.blob()).then((blob) => blob.text()).then((text) => {convertToReact(text,setContent)})
}
catch(e){
console.log(e)
}
}


function convertToReact(html,setContent){
	let r = html
	html.split('src="').forEach((u,i) => {
		if(i != 0){
	 const path = decodeURIComponent('protected/' + u.split('"')[0].split('/protected/')[1].split('?')[0])
	genURL(path).then((res) => {r = r.replace(u.split('"')[0],res.href);setContent(r)})
		}})
}

function EditPost(){
const handleImageUpload = () => {
  const input = document.createElement('input');
	input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (file) {
      const formData = new FormData();
	    console.log(file)
      formData.append('image', file);

      // Replace with your API endpoint
      const response = await uploadData( {
	      path:"protected/" + puser + '/' + id + '/' + file.name,
        data: file
      }).result;
	    console.log("protected/" + puser + '/' + id + '/' + file.name)
      const downloadResult = await getUrl({
    path: "protected/" + puser + '/' + id + '/' + file.name
  });
      console.log(downloadResult.url.href)
      const imageUrl = downloadResult.url.href;
console.log(quill.current)
      const range = quill.current.getEditor().getSelection();
      quill.current.getEditor().insertEmbed(range.index, 'image', imageUrl);
    }
  });

  input.click();
};
	Amplify.configure(config);
const[post,setPost] = useState(null);
const {id} = useParams()
const {puser} = useParams()
const quill = useRef(null)
	const [content, setContent] = useState('');
	
	useEffect(() => {
	Quill.register('modules/imageResize', ImageResize);
		getPost(setPost,puser,id)
		loadPost(id,puser,setContent,content)
	},[])

  const handleContentChange = (value) => {
    setContent(value);
  };


const modules = {
	toolbar: {container:[
	[{ 'header': [1, 2, 3, 4, 5, 6, false] },{ 'font': [] },{ 'align': [] }],
    ['bold', 'italic', 'underline','strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image','video'],[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  
  
  ],
	handlers: {
      image: handleImageUpload,
    }},
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
			<ReactQuill ref={quill} theme="snow" value={content} onChange={handleContentChange} modules={modules}/>
			<button onClick={() => (uploadFile(content,id))}>Save Post</button>
			</>
		) : (<Navigate to={'/post/' + id}/>))}
		</Authenticator>
			</>
	)}
}

export default EditPost
