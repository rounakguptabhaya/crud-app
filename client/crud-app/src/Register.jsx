import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';



const Register = () => {

    const [values, setValues] = useState({
        first_name:"",
        last_name:"",
        username:"",
        password:"",
        isAdmin:"0",
        email:""
    });
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8800/users',values)
        .then(res => {
            if(res.data.Status === "Success") {
                navigate("/login");
            }else{
                alert("Error");
            }
        })
        .then(err => console.log(err))
    }

  return (
    <div className='container'>
    <div className='form-container'>
            <h2>Sign up</h2>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form-element'>
                    <input type='text' autoComplete='off' name='first_name' placeholder='Enter First Name' size={30} onChange={e => setValues({...values, first_name: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='text' autoComplete='off' name='last_name' placeholder='Enter Last Name' size={30} onChange={e => setValues({...values, last_name: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='text' autoComplete='off' name='username' placeholder='Enter username' size={30} onChange={e => setValues({...values, username: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='password' autoComplete='off' name='password' placeholder='Enter password' size={30} onChange={e => setValues({...values, password: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='text' autoComplete='off' placeholder='Enter Email' size={30} name='email' onChange={e => setValues({...values, email: e.target.value})}/>
                </div>

                <button type='submit' className='login-btn'>Sign up</button>
                <Link to="/login">Login</Link>
            </form>
    </div>
        
    </div>
  )
}

export default Register