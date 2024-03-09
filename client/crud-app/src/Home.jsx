import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const [auth,setAuth] = useState(false);
    const [message,setMessage] = useState("");
    const [name,setName] = useState("");
    axios.defaults.withCredentials = true;
    const [data,setData] = useState([]);

    

    // const navigate = useNavigate();
    
    axios.defaults.withCredentials = true;


    useEffect(() => {
        axios.get("http://localhost:8800",name)
        .then(res => {
            console.log((res.data.Status));
           if(res.data.Status === "Success"){
             setAuth(true);
            setName(res.data.username);
            setData(res.data.result[0]);
            data ? console.log(data) : console.log(loading);;
            
            //  navigate("/login");
           }else{
            setAuth(false);
            setMessage(res.data.Error)
           }
        })
    }, [])

    const handleLogout = () => {
        axios.get("http://localhost:8800/logout")
        .then(res => {
            location.reload(true);
        }).catch(err => console.log((err)))
    }
  return (
    
    <div className='container'>
        {
            auth ?
            <div className='dashboard-container'>
                <div className='dashboard-content'>
                    <h2>Welcome {name}</h2>
                    <h3>Your Details</h3>
                    {
                        data ? (
                            <>
                                <h3>{data.first_name} {data.last_name}</h3>
                                <h3>{data.email}</h3>
                            </>

                        ) 
                        : 
                        (
                            <p>loading...</p>
                        )
                    }
                    <button onClick={handleLogout} className='logout-btn'>Logout</button>
                </div>
            </div>
            
            :
            <div className='dashboard-container'>
                <div>
                    <h3>Logged out Successfully</h3>
                    <h3>Login now</h3>
                    <Link to="/login" className=''>Login</Link>
                </div>
            </div>
            
        }
    </div>
  )
}

export default Home