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
import { MDXEditor,Separator, BlockTypeSelect,BoldItalicUnderlineToggles,CodeToggle,CreateLink,HighlightToggle,InsertCodeBlock,InsertImage,imagePlugin,InsertTable,InsertThematicBreak,ListsToggle,UndoRedo, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
function uploadFile(id,ref,setSource)  {
	console.log(ref.current.getMarkdown())
	setSource(ref.current.getMarkdown())
	const blob = new Blob([ref.current.getMarkdown()],{type: "text/plain"})
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
		path:'protected/' + session.identityId + '/' + id + '/' + 'post.mkd',
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

const loadPost = async (id,puser,ref,value) => {
try{
	const downloadResult = await getUrl({
    path: "protected/" + puser + '/' + id + '/post.mkd'
  });
	console.log(downloadResult)
  fetch(downloadResult.url).then((res) => res.blob()).then((blob) => blob.text()).then((text) => {ref.current.setMarkdown(text);convertToReact(text,ref)})
}
catch(e){
console.log(e)
}
}


function convertToReact(html,ref){
	let r = html
	console.log(html)
	html.split('src="').forEach((u,i) => {
		if(i != 0){
	 const path = decodeURIComponent('protected/' + u.split('"')[0].split('/protected/')[1].split('?')[0])
	genURL(path).then((res) => {r = r.replace(u.split('"')[0],res.href);ref.current.setMarkdown(r);console.log(r)})
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
		loadPost(id,puser,ref,content)
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
const ref = useRef(null)
const[source,setSource] = useState('Test')
const components = {
  em: props => <i {...props} />
}
const toolbar = toolbarPlugin({
	toolbarClassName: 'editorToolbar',
	toolbarContents: () => (
		<>
			<UndoRedo/>
			<Separator/>
			<BlockTypeSelect/>
		</>
	)
})
if(post == null){return null}
	else {
		return(
		<>
		<Authenticator> 
		{({signOut,user}) => (user.username === post.username.toString() ? (
			<>
			<div> 
			<MDXEditor ref={ref} markdown="# Hello world" plugins={[toolbar,headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin()]} />
			</div>
			<button onClick={() => (uploadFile(id,ref,setSource))}>Save Post</button>
			</>
		) : (<Navigate to={'/post/' + id}/>))}
		</Authenticator>
			</>
	)}
}

export default EditPost
