import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [values, setValues] = useState({
        username:"",
        password:"",
    });
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8800/login',values)
        .then(res => {
            if(res.data.Status === "Success") {
                console.log("Logged in Successfully");
                const isAdmin = res.data.user.isAdmin;
                if(isAdmin == 0){
                    navigate("/");
                }
                else{
                    navigate("/admin-dashboard");
                }
                
            }else{
                console.log("Log in problem");
                alert(res.data.message);
            }
        })
        .then(err => console.log(err))
    }

  return (
    <div className='container'>
    <div className='form-container'>
            <h2>Log in</h2>
            <form className='form' onSubmit={handleSubmit}>
                
                <div className='form-element'>
                    <input type='text' autoComplete='off' placeholder='Enter username' size={30} name='username' onChange={e => setValues({...values, username: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='password' autoComplete='off' placeholder='Enter password' size={30} name='password' onChange={e => setValues({...values, password: e.target.value})}/>
                </div>
                <button type='submit' className='login-btn'>Login</button>
                <Link to="/register">Create new account</Link>
            </form>
    </div>
        
    </div>
  )
}

export default Login