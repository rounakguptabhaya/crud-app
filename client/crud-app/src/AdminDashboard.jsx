import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
    const [auth,setAuth] = useState(false);
    const [message,setMessage] = useState("");
    const [name,setName] = useState("");
    axios.defaults.withCredentials = true;
    const [data,setData] = useState([]);

    

    const navigate = useNavigate();
    
    axios.defaults.withCredentials = true;


    useEffect(() => {
        axios.get("http://localhost:8800/admin-dashboard")
        .then(res => {
           if(res.data.Status === "Success"){
             setData(res.data.result);
             setAuth(true);
            setName(res.data.username);
           }
           else if(res.data.Status === "You are user"){
            navigate("/");
           }
           else{
            setAuth(false);
            setMessage(res.data.Error)
           }
        })
    }, [])

    const handleDelete = (id) => {
        // console.log(id);
        axios.delete("http://localhost:8800/delete/"+id)
        .then(res => {
            location.reload();
        })
        .catch(err => console.log(err))
        
    }

    const handleLogout = () => {
        axios.get("http://localhost:8800/logout")
        .then(res => {
            location.reload(true);
        }).catch(err => console.log((err)))
    }
  return (
    <>
    
    <div className='container'>
        {
            auth ?
            <div className='dashboard-container'>
                <div className='dashboard-content'>
                    <h3>Admin Dashboard</h3>
                    <h3>Welcome {name}</h3>
                    <button onClick={handleLogout} className='logout-btn'>Logout</button>
                    <h2>Users:-</h2>
                    <div>
                        <Link to="/create" className='operation'>Create</Link>
                    </div>
                    <div className='table-container'>
                        
                        <table>
                            <thead>
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Edit/Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((user,index) => {
                                    return <tr key={index}>
                                        {/* <td>{user.id}</td> */}
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Link to={`/read/${user.id}`} className='operation'>Read</Link>
                                            <Link to={`/edit/${user.id}`} className='operation'>Edit</Link>
                                            <button onClick={() => handleDelete(user.id)}className='operation'>Delete</button>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            :
            <div className='dashboard-container'>
                <h3>{message}</h3>
                <h3>Login now</h3>
                <Link to="/login" className=''>Login</Link>
            </div>
        }
    </div>
    

    </>
  )
}

export default AdminDashboard