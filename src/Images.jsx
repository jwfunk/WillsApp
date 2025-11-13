import {useRef, useState, useEffect } from 'react'
import {  useSearchParams } from "react-router-dom";
import { getUrl, list, remove } from 'aws-amplify/storage';
import {  Marker, Popup } from 'react-leaflet'
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { fetchAuthSession } from 'aws-amplify/auth'
const getUserID = async (setID) => {
	const session = await fetchAuthSession()
	setID(session.identityId)
}

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
        const [id, setID] = useState(null);
        const path = 'protected/' + id + '/images/'
        const [searchParams, setSearchParams] = useSearchParams();
        const url = 'https://willsapp9f2fe81319484cdd95064882e08262c2c8a09-dev.s3.us-east-2.amazonaws.com/'
        useEffect(() => {
        async function getData() {
        const response = await list({path: (searchParams.get("user") === null ? path : 'protected/' + searchParams.get("user") + '/images/')});
		let result = []
		response.items.forEach((i) => {
		if(i.size){
			result.push(i)
		}
		})
                if(!data && result.length > 0){
                        var top = result[0].path.split('/')[3];
                        var bot = result[0].path.split('/')[3];
                        var r = result[0].path.split('/')[4];
                        var l  = result[0].path.split('/')[4];
                        for(let i = 1;i < result.length; i++){
                                if(result[i].path.split('/')[3] > top){
                                        top = result[i].path.split('/')[3]
                                }
                                if(result[i].path.split('/')[3] < bot){
                                        bot = result[i].path.split('/')[3]
                                }
                                if(result[i].path.split('/')[4] > r){
                                        r = result[i].path.split('/')[4]
                                }
                                if(result[i].path.split('/')[4] < l){
                                        l = result[i].path.split('/')[4]
                                }
                        }
                        setBounds([[top,r],[bot,l]])
                }
                setData(result)
        }
        if(!data || update != null) {
        getData()
        }
	if(searchParams.get("user") == null && id == null){
		getUserID(setID)
	}
	if(id != null){
		console.log(id)
	}
        },[update,id]);
        return data === null ? null : (<div>{data.map(a => (<Marker position={[a.path.split('/')[3],a.path.split('/')[4]]}><Popup><div style={{width:"300px"}}><Link path={a.path} u = {(searchParams.get("user") == null)} setUpdate={setUpdate}/></div></Popup></Marker>))}</div>)
}
