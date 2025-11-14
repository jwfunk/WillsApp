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

function Post(){
        Amplify.configure(config);
const[post,setPost] = useState(null);
const {id} = useParams()
const {puser} = useParams()
        const [content, setContent] = useState('');

        useEffect(() => {
                getPost(setPost,puser,id)
                loadPost(id,puser,setContent)
        },[])


if(post == null){return null}
        else {
                return(
			<div dangerouslySetInnerHTML={{ __html: content }} />
        )}
}

export default Post
