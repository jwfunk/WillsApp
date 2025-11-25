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
import { MDXEditor, Separator, BlockTypeSelect,BoldItalicUnderlineToggles,CodeToggle,CreateLink,HighlightToggle,InsertCodeBlock,InsertImage,imagePlugin,InsertTable,InsertThematicBreak,ListsToggle,UndoRedo, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor'
import {linkDialogPlugin, linkPlugin,tablePlugin } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'
function uploadFile(id,ref)  {
	console.log(ref.current.getMarkdown())
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

const loadPost = async (id,puser,setContent,value) => {
try{
	const downloadResult = await getUrl({
    path: "protected/" + puser + '/' + id + '/post.mkd'
  });
	console.log(downloadResult)
  fetch(downloadResult.url).then((res) => res.blob()).then((blob) => blob.text()).then((text) => {setContent(text);convertToReact(text,setContent)})
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
	genURL(path).then((res) => {r = r.replace(u.split('"')[0],res.href);setContent(r);console.log(r)})
		}})
}

function EditPost(){
async function imageUploadHandler(image){

      const formData = new FormData();
	    console.log(image)
      formData.append('image', image);

      // Replace with your API endpoint
      const response = await uploadData( {
	      path:"protected/" + puser + '/' + id + '/' + image.name,
        data: image
      }).result;
	    console.log("protected/" + puser + '/' + id + '/' + image.name)
      const downloadResult = await getUrl({
    path: "protected/" + puser + '/' + id + '/' + image.name
  });
      console.log(downloadResult.url.href)
      const imageUrl = downloadResult.url.href;
	    return imageUrl
};
	Amplify.configure(config);
const[post,setPost] = useState(null);
const {id} = useParams()
const {puser} = useParams()
const [content, setContent] = useState('');
	
useEffect(() => {
Quill.register('modules/imageResize', ImageResize);
	getPost(setPost,puser,id)
	loadPost(id,puser,setContent,content)
},[])

const ref = useRef(null)
const components = {
  em: props => <i {...props} />
}
const toolbar = toolbarPlugin({
	toolbarContents: () => (
		<>
			<UndoRedo/>
			<Separator/>
			<BoldItalicUnderlineToggles/>
			<HighlightToggle/>
			<ListsToggle/>
			<Separator/>
			<BlockTypeSelect/>
			<Separator/>
			<InsertTable/>
			<InsertImage/>
			<CreateLink/>
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
			<MDXEditor contentEditableClassName="prose" ref={ref} markdown={content} plugins={[linkDialogPlugin(),tablePlugin(),linkPlugin(),toolbar,headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(),imagePlugin({imageUploadHandler})]} />
			</div>
			<button onClick={() => (uploadFile(id,ref))}>Save Post</button>
			</>
		) : (<Navigate to={'/post/' + id}/>))}
		</Authenticator>
			</>
	)}
}

export default EditPost
