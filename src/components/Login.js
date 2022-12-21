import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
const[credential,setCredential]=useState({email:"",password:""})
let navigate=useNavigate();


    const handleSubmit=async(e)=>{
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email:credential.email,password:credential.password}),
      });
      const json=await response.json()
      console.log(json);
      if(json.success){
        //save the auth token and redirect
        localStorage.setItem('token',json.authToken);
        navigate("/")
      }
      else{
        alert("invalid credentials")
      }
    }

    const handleChange=(e)=>{
        setCredential({...credential,[e.target.name]:e.target.value})
}

  return (
    <>
    <div className='container mt-5'>
    <center><div className='col-md-6 bg-dark text-white rounded'>
      <form onSubmit={handleSubmit}>
        <br></br>
  <div className="mb-3 mx-2">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" onChange={handleChange} value={credential.email} name="email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3 mx-2">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" onChange={handleChange} className="form-control" value={credential.password} id="password" name="password"/>
  </div>
  <button type="submit" className="btn btn-primary mt-2">Submit</button>
  
</form>
<br></br>
    </div></center>
    </div>
    </>
  )
}

export default Login
