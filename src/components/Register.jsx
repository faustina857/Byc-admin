import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Byc, Spec } from '../assets'
import './style.css'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({
    spinItem: false,
    error: null,
    success: false
  });

  const { name, email, password } = formData;
  const { spinItem, error, success } = status;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus((prev) => ({ ...prev, spinItem: true, error: null }));

    try {
      await axios.post('http://localhost:3001/api/byc-stores/user/register', formData);
      setStatus((prev) => ({ ...prev, spinItem: false, success: true }));
    } catch (err) {
       const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
       setStatus((prev) => ({ ...prev, spinItem: false, error: errorMessage }));
    }
  };

  useEffect(() => {
    if (success) {
      navigate('/dashboard');
    }
  }, [success, navigate]);

  return (
    <div>
      <React.Fragment>
      <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-6 text-center top-form" 
            style={{ backgroundColor: '#BD3A3A',height:"800px"}}>
              <div className="log-img" style={{marginTop:'300px'}}>
                  <img src={ Byc } alt=""/>
              </div>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6 bottom-form" 
            style={{
              backgroundImage: `linear-gradient( rgba(189, 58, 58, 0.6),
              rgba(189, 58, 58, 0.6) ),url(${Spec})`, backgroundRepeat: 'no-repeat', 
              backgroundSize: 'cover', backgroundPosition: 'center bottom'
              }}>
                <form className='form-sec' onSubmit={handleRegister}>
                    <h2 className='text-center mb-5'>Sign Up</h2>

                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" placeholder='Enter Fullname here' name="name" value={name} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" placeholder='Enter email here' name='email' value={email} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Enter Password</label>
                        <input type="password" className="form-control" placeholder='Enter password here' name='password' value={password} onChange={handleChange}/>
                    </div>
                    <button type="submit" className="log-btn">
                        {
                            spinItem ? (
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            ): (
                                'Sign Up'
                            )
                        }
                    </button>
                    {error && <p className="text-danger">Error: {error}</p>}
                    {success && <p className="text-success">Registration successful!</p>}
                </form>
          </div>
      </div>
    </React.Fragment>
    </div>
  )
}

export default Register
