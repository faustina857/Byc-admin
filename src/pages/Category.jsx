import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/byc-stores/category/get-all-categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (updatingId) {
        await axios.put(`http://localhost:3001/api/byc-stores/category/update-category/${updatingId}`, 
          { name }, 
          {
            headers: { "x-auth-token": localStorage.getItem("adminToken") },
          }
        );
        Swal.fire({
          icon:'success',
          title:'category updated'
        })
      } else {
        await axios.post('http://localhost:3001/api/byc-stores/category/add-new-category', 
          { name }, 
          {
            headers: { "x-auth-token": localStorage.getItem("adminToken") },
          }
        );
        Swal.fire({
          icon:'success',
          title:'category added'
        })
      }
      setName('');
      setUpdatingId(null);
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Submit error:', err.response?.data || err.message);
    }
  };

  const handleUpdate = (category) => {
    setName(category.name);
    setUpdatingId(category._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm)
     return;
    Swal.fire({
        icon:'warning',
        title:"Are you sure you want to delete?"})
    
    try {
      await axios.delete(`http://localhost:3001/api/byc-stores/category/delete-category/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("adminToken") },
      });
      Swal.fire({
          icon:'success',
          title:'category deleted'
        })
      fetchCategories();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
    }
  };

  // Inline styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    minWidth: '400px',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    zIndex: 10000,
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  };

  const submitButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <div className="category-page">
      <h2>Categories</h2>
      <button className="add-btn" onClick={() => {setShowModal(true)}}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Add New Category
      </button>

      {showModal && (
        <div style={modalOverlayStyle} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowModal(false);
            setUpdatingId(null);
            setName('');
          }
        }}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
              {updatingId ? 'Update Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={buttonContainerStyle}>
                <button type="submit" style={submitButtonStyle}>
                  {updatingId ? 'Update' : 'Add'}
                </button>
                <button type="button" 
                  style={cancelButtonStyle}
                  onClick={() => { 
                    setShowModal(false); 
                    setUpdatingId(null); 
                    setName(''); 
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className='cate-table' style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
              <tr key={cat._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  {cat.name}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  <button onClick={() => handleUpdate(cat)}
                    style={{
                      padding: '6px 12px',
                      marginRight: '8px',
                      color:'#fff',
                      backgroundColor: '#28a745',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Update
                  </button>
                  <button onClick={() => handleDelete(cat._id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Categories;