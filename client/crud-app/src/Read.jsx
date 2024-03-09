import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Read = () => {
    const { id } = useParams();
    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8800/read/" + id)
            .then(res => {
                // console.log(res.data[0]);
                setUser(res.data[0]);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='container'>
            <div className='dashboard-container'>
                <div className='dashboard-content'>
                    <h2>User Detail</h2>
                    {user ? (
                        <>
                            <h2>{user.id}</h2>
                            <h2>{user.first_name} {user.last_name}</h2>
                            <h2>{user.email}</h2>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                
                <Link to="/admin-dashboard" className='operation'>Back</Link>
                <Link to={`/edit/${user.id}`} className='operation'>Edit</Link>
            </div>
        </div>
    );
};

export default Read;
