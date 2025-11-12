import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Post from './Post.jsx'
import EditPost from './EditPost.jsx'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<Router>
	<Routes>
	<Route path="/" element={<App/>}/>
	<Route path="/post/:id" element={<Post/>}/>
	<Route path="/post/edit/:puser/:id" element={<EditPost/>}/>
	</Routes>
	</Router>
  </StrictMode>,
)
