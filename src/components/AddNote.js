import React,{useContext,useState} from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = () => {
    const context = useContext(noteContext);
    const{addNote}=context;

    const[note,setNote]=useState({title:"", description:"", tag:""})

    const handleClick=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""})
    }

    const handleChange=(e)=>{
            setNote({...note,[e.target.name]:e.target.value})
    }
  return (

    <div className='container my-3'>
      <h2>Add a Note</h2>
      <form className='my-3'>
<div className="mb-3">
  <label htmlFor="title" className="form-label">Title</label>
  <input type="text" className="form-control" onChange={handleChange} minLength={3} required id="title" name="title" value={note.title} aria-describedby="emailHelp"/>
</div>
<div className="mb-3">
  <label htmlFor="description" className="form-label">Description</label>
  <input type="text" onChange={handleChange} value={note.description} minLength={5} required className="form-control" id="description" name="description"/>
</div>
<div className="mb-3">
  <label htmlFor="tag" className="form-label">Tag</label>
  <input type="text" onChange={handleChange} value={note.tag} minLength={3} required className="form-control" id="tag" name="tag"/>
</div>
<button type="submit" disabled={note.title.length<3 || note.description.length<5} className="btn btn-primary" onClick={handleClick}>Add Note</button>
</form>
    </div>
  )
}

export default AddNote
