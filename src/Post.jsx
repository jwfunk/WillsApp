import {  useParams,Navigate } from "react-router-dom";
import {getPost} from './Posts.jsx'
import {useRef, useState,useEffect } from 'react'
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import { Authenticator,Menu,MenuItem } from '@aws-amplify/ui-react';
import {uploadData} from "@aws-amplify/storage";
import { fetchAuthSession } from 'aws-amplify/auth'
import {getUrl, downloadData } from 'aws-amplify/storage';
import { MDXEditor, Separator, BlockTypeSelect,BoldItalicUnderlineToggles,CodeToggle,CreateLink,HighlightToggle,InsertCodeBlock,InsertImage,imagePlugin,InsertTable,InsertThematicBreak,ListsToggle,UndoRedo, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor'
import {linkDialogPlugin, linkPlugin,tablePlugin } from '@mdxeditor/editor';                                    
import '@mdxeditor/editor/style.css'

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


function convertToReact(html,setContent){
        let r = html
        console.log(html)
        html.split('src="').forEach((u,i) => {
                if(i != 0){
         const path = decodeURIComponent('protected/' + u.split('"')[0].split('/protected/')[1].split('?')[0])
        genURL(path).then((res) => {r = r.replace(u.split('"')[0],res.href);setContent(r);console.log(r)})
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

const ref = useRef(null)
const components = {
  em: props => <i {...props} />
}
if(post == null){return null}
        else {
                return(
                <>
                <Authenticator>
                {({signOut,user}) => (user.username === post.username.toString() ? (
                        <>
                        <div>
                        <MDXEditor readOnly={true} contentEditableClassName="prose" ref={ref} markdown={content} plugins={[linkDialogPlugin(),tablePlugin(),linkPlugin(),headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(),imagePlugin()]} />
                        </div>
                        <button onClick={() => (uploadFile(id,ref))}>Save Post</button>
                        </>
                ) : (<Navigate to={'/post/' + id}/>))}
                </Authenticator>
                        </>
        )}
}

export default Post
