import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Byc, Spec } from '../assets'
import './style.css'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({
    spinItem: false,
    error: null,
    success: false
  });

  const { email, password } = formData;
  const { spinItem, error, success } = status;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus((prev) => ({ ...prev, spinItem: true, error: null }));
    
    try {
      const response = await axios.post('http://localhost:3001/api/byc-stores/auth/login', formData);
      const { token, isAdmin } = response.data;

    // 🚫 Block non-admin users
    if (!isAdmin) {
      setStatus((prev) => ({
        ...prev,
        spinItem: false,
        error: "Access denied: Admins only",
      }));
      return;
    }
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(response.data));
      setStatus((prev) => ({ ...prev, spinItem: false, success: true }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setStatus((prev) => ({ ...prev, spinItem: false, error: errorMessage }));
    }
  };

  useEffect(() => {
    if (success) {
      navigate('/dashboard');
    }
  }, [success, navigate]);

  return (
    <React.Fragment>
      <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-6 text-center top-form" 
            style={{ 
              backgroundColor: '#BD3A3A',height:"700px"
              }}>
              <div className="log-img" 
                style={{marginTop:'300px'}}>
                  <img src={ Byc } alt=""/>
              </div>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6 bottom-form" 
            style={{
              backgroundImage: `linear-gradient( rgba(189, 58, 58, 0.6),
              rgba(189, 58, 58, 0.6) ),url(${Spec})`, backgroundRepeat: 'no-repeat', 
              backgroundSize: 'cover', backgroundPosition: 'center bottom'
              }}>
                <form className='form-sec' onSubmit={handleLogin}>
                    <h2 className='text-center mb-5'>Login</h2>

                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" placeholder='Enter email here' name='email' value={email} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                         <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder='Enter password here' name='password' value={password} onChange={handleChange}/>
                    </div>
                    <button type="submit" className="log-btn">
                        {
                            spinItem ?(
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            ): (
                                'Login'
                            )
                        }
                    </button>
                    {error && <p className="text-danger">Error: {error}</p>}
                    {success && <p className="text-success">Login successful!</p>}
                </form>
          </div>
      </div>
    </React.Fragment>
  )
}

export default Login
