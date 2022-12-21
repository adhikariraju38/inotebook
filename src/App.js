import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
// import Alert from "./components/Alert";
import React from "react";
import Login from "./components/Login";

function App() {
  // const[alert,setAlert]=useState(null);

  // const showAlert =(message,type)=>{
  //  setAlert({
  //    msg:message,
  //    type:type
  //  })
  //  setTimeout(() => {
  //    setAlert(null);
  //  }, 2000);

  // }
  return (
    <>
    
    <NoteState>
      <Router>
        <Navbar />
        <div className="container">

        <Routes>
          
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/about" element={<About />}></Route>
          <Route exact path="/login" element={<Login/>}></Route>
          {/* <Route exact path="home" element={<Home />} ></Route> */}
        </Routes>
        </div>
      </Router>
      </NoteState>
    </>
  );
}

export default App;
