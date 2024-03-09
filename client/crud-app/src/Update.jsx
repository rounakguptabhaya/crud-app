import React,{useState,useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const Update = () => {

    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8800/read/" + id)
            .then(res => {
                // console.log(res.data[0]);
                setValues({...values, first_name: res.data[0].first_name,last_name:res.data[0].last_name,username:res.data[0].username,email:res.data[0].email});
            })
            .catch(err => console.log(err));
    }, []);

    const [values, setValues] = useState({
        first_name:"",
        last_name:"",
        username:"",
        isAdmin:"0",
        email:""
    });

    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put("http://localhost:8800/update/"+id,values)
        .then(res => {
            console.log(res)
            navigate("/admin-dashboard");
        }).catch(err => console.log(err))
    }
  return (
    <div className='container'>
    <div className='form-container'>
            <h2>Update User</h2>
            <form className='form' onSubmit={handleUpdate}>
                <div className='form-element'>
                    <input type='text' autoComplete='off' name='first_name' placeholder='Enter First Name' size={30} value={values.first_name} onChange={e => setValues({...values, first_name: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='text' autoComplete='off' name='last_name' placeholder='Enter Last Name' size={30}value={values.last_name} onChange={e => setValues({...values, last_name: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='text' autoComplete='off' name='username' placeholder='Enter username' size={30} value={values.username} onChange={e => setValues({...values, username: e.target.value})}/>
                </div>
                <div className='form-element'>
                    <input type='text' autoComplete='off' placeholder='Enter Email' size={30} name='email' value={values.email} onChange={e => setValues({...values, email: e.target.value})}/>
                </div>

                <button type='submit' className='login-btn'>Update</button>
                <Link to="/admin-dashboard">Go to Admin Dashboard</Link>
            </form>
    </div>
        
    </div>
  )
}

export default Update