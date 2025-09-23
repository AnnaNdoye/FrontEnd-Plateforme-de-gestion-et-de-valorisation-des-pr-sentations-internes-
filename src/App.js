import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import DepartementsPage from "./pages/DepartementsPage";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<DepartementsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
