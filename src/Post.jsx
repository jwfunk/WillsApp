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
  });                                                                                                                           console.log(downloadResult);                                                                                       fetch(downloadResult.url).then((res) => res.blob()).then((blob) => blob.text()).then((text) => {convertToReact(text,setContent)})
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

function Post(){
        Amplify.configure(config);
const[post,setPost] = useState(null);
const {id} = useParams()
const {puser} = useParams()
        const [content, setContent] = useState('');

        useEffect(() => {
                getPost(setPost,puser,id)
                loadPost(id,puser,setContent,content)
        },[])


if(post == null){return null}
        else {
                return(
			<div dangerouslySetInnerHTML={{ __html: content }} />
        )}
}

export default Post
