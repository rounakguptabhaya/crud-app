import React from "react";
import {BrowserRouter, Routes,Route} from "react-router-dom"
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import Create from "./Create";
import Read from "./Read";
import Update from "./Update";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route path="/read/:id" element={<Read />}></Route>
        <Route path="/edit/:id" element={<Update />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
