import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRef,useState,useEffect } from 'react'
const extensions = [
  StarterKit,
]

const content = '<p>Hello there!</p>'

function Tiptap() {
  const[post,setPost] = useState(null);
  return <EditorProvider extensions={extensions} content={content} />
}

export default Tiptap
