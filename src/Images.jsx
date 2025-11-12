import {useRef, useState, useEffect } from 'react'
import {  useSearchParams } from "react-router-dom";
import { getUrl, list, remove } from 'aws-amplify/storage';
import {  Marker, Popup } from 'react-leaflet'
import { StorageImage } from '@aws-amplify/ui-react-storage';
export function Link({path,u,setUpdate}){
        const [l, setL] = useState(null);
        async function getLink(){
        const link = await getUrl({path:path})
        console.log(link.url)
        setL(link.url.href)
        }
        getLink()
        if(u){
        return (<>
                <a href = {l}><StorageImage path = {path} /></a>
                <button onClick={() => {Remove(path,setUpdate)}}>Remove</button>
                </>)
        }
        else{
        return (<a href = {l}><StorageImage path = {path} /></a>)
}}
export async function Remove(path,setUpdate){
        await remove({path: path})
        setUpdate("removed " + path)
}
export function UserImages({user,update,setBounds,setUpdate}){
        const [data, setData] = useState(null);
        const path = 'public/' + user.username + '/'
        const [searchParams, setSearchParams] = useSearchParams();
        const url = 'https://willsapp9f2fe81319484cdd95064882e08262c2c8a09-dev.s3.us-east-2.amazonaws.com/'
        useEffect(() => {
        async function getData() {
        const result = await list({path: (searchParams.get("user") === null ? path : 'public/' + searchParams.get("user") + '/')});
                console.log(result)
                if(!data){
                        var top = result.items[0].path.split('/')[2];
                        var bot = result.items[0].path.split('/')[2];
                        var r = result.items[0].path.split('/')[3];
                        var l  = result.items[0].path.split('/')[3];
                        for(let i = 1;i < result.items.length; i++){
                                if(result.items[i].path.split('/')[2] > top){
                                        top = result.items[i].path.split('/')[2]
                                }
                                if(result.items[i].path.split('/')[2] < bot){
                                        bot = result.items[i].path.split('/')[2]
                                }
                                if(result.items[i].path.split('/')[3] > r){
                                        r = result.items[i].path.split('/')[3]
                                }
                                if(result.items[i].path.split('/')[3] < l){
                                        l = result.items[i].path.split('/')[3]
                                }
                        }
                        setBounds([[top,r],[bot,l]])
                }
                setData(result)
        }
        if(!data || update != null) {
        getData()
        }
        },[update]);
        return data === null ? null : (<div>{data.items.map(a => (<Marker position={[a.path.split('/')[2],a.path.split('/')[3]]}><Popup><div style={{width:"300px"}}><Link path={a.path} u = {(searchParams.get("user") == null)} setUpdate={setUpdate}/></div></Popup></Marker>))}</div>)
}
