import React,{useContext} from 'react'
import noteContext from '../context/notes/noteContext';
import Noteitems from './Noteitems';
import AddNote from './AddNote';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  let navigate=useNavigate();
    const context = useContext(noteContext);
  const{notes,getNotes}=context;

    useEffect(()=>{
      if(localStorage.getItem('token'))
      {
        
        getNotes()

        
      }
      else{
        navigate('/login')
      }
      
        
    },[])

    const ReverseArray=[];
    const length=notes.length;
    for (let index = length-1; index >=0; index--) {
      ReverseArray.push(notes[index]);   
    }
    
  return (
    <>
    <AddNote/>
    <div className='row my-3'>
    <h2>Your Note</h2>
    <div className='container mx-1'>
      {notes.length===0 && 'No notes to display'} 
    </div>
    {
      ReverseArray.map((note)=>{
        return <Noteitems key={note._id} note={note}/>
      })
    }
    </div>
    </>
  )
}

export default Notes
