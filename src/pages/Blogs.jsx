import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [updatingBlog, setUpdatingBlog] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    blogImage: '',
    blogTitle: '',
    blogDescription: '',
    blogContent: '',
    ownerName: '',
    ownerImage: '',
    ownerProfession: ''
  });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
    const res = await axios.get('http://localhost:3001/api/byc-stores/blog/get-all-blogs');
    setBlogs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch blogs");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (updatingBlog) {
      await axios.put(
        `http://localhost:3001/api/byc-stores/blog/update-blog/${updatingBlog}`,
        formData,
        { headers: { "x-auth-token": token } }
      );

      Swal.fire("Updated!", "Blog updated successfully", "success");
    } else {
      await axios.post(
        "http://localhost:3001/api/byc-stores/blog/add-new-blog",
        formData,
        { headers: { "x-auth-token": token } }
      );

      Swal.fire("Created!", "Blog added successfully", "success");
    }

    setShowForm(false);
    setUpdatingBlog(null);
    updateForm();
    fetchBlogs();
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Something went wrong",
      "error"
    );
  }
};


  const handleUpdate = (blog) => {
    setUpdatingBlog(blog._id);
    setShowForm(true);

    setFormData({
    blogImage: blog.blogImage || "",
    blogTitle: blog.blogTitle || "",
    blogDescription: blog.blogDescription || "",
    blogContent: blog.blogContent || "",
    ownerName: blog.ownerName || "",
    ownerImage: blog.ownerImage || "",
    ownerProfession: blog.ownerProfession || "",
  });
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
        title: "Delete Blog?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#BD3A3A",
        cancelButtonColor: "#999",
        confirmButtonText: "Yes, delete it!",
      });
    
        if (!confirmDelete.isConfirmed) return;
        try{
    await axios.delete(`http://localhost:3001/api/byc-stores/blog/delete-blog/${id}`,
      {
          headers: { "x-auth-token": token },
      }
    );
      Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Blog has been deleted successfully.",
          });

    fetchBlogs();
     } catch (err) {
          Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.response?.data?.message || "Something went wrong",
        });
        }
  };
  const updateForm = () => {
  setFormData({
    blogImage: "",
    blogTitle: "",
    blogDescription: "",
    blogContent: "",
    ownerName: "",
    ownerImage: "",
    ownerProfession: "",
  });
};


  return (
    <div>
      <button onClick={() => { setShowForm(true);
          setUpdatingBlog(null);
          updateForm();
        }}
        style={{
          background: "#BD3A3A",border: "none",color: "#fff",
          padding: "10px",borderRadius: "5px",marginBottom:'10px',
        }}
      >
        Add blog
      </button>
      <div className="table-wrapper">
        <table className='blog-table'>
          <thead >
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Owner's name</th>
              <th>Owner's image</th>
              <th>Owner's profession</th>
              <th>Actions</th>
            </tr>
          </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog._id}>
              <td>
                <img src={blog.blogImage} className='blog-thumb' />
              </td>
              <td>{blog.blogTitle}</td>
              <td>{blog.ownerName}</td>
              <td>
                <img src={blog.ownerImage} alt="" />
              </td>
              <td>{blog.ownerProfession}</td>
              <td>
              <div style={{display:'flex',gap:'10px'}}>
                <button style={{ color: "#fff",backgroundColor:'limegreen',border:'none',padding:'8px',borderRadius:'5px' }} 
                onClick={() => handleUpdate(blog)}>Update</button>
                <button style={{ color: "#fff",backgroundColor:'#BD3A3A',border:'none',padding:'8px',borderRadius:'5px' }} 
                onClick={() => handleDelete(blog._id)}>Delete</button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    

    {showForm && (
        <form onSubmit={handleSubmit}>
          <h3>{updatingBlog ? "Update Blog" : "Add New Blog"}</h3>
        <input name="blogTitle" placeholder="Blog Title" value={formData.blogTitle} onChange={handleChange} 
        required className="mb-2"/>
        <input name="blogImage" placeholder="Blog Image URL" value={formData.blogImage} onChange={handleChange} 
        required className="mb-2"/>
        <input name="blogDescription" placeholder="Short Description" value={formData.blogDescription} onChange={handleChange} 
        required className="mb-2"/>
        <textarea name="blogContent" placeholder="Blog Content" value={formData.blogContent} onChange={handleChange} 
        required className="mb-2"/>

        <input name="ownerName" placeholder="Author Name" value={formData.ownerName} onChange={handleChange} 
        required className="mb-2"/>
        <input name="ownerImage" placeholder="Author Image URL" value={formData.ownerImage} onChange={handleChange} 
        required className="mb-2"/>
        <input name="ownerProfession" placeholder="Author Profession" value={formData.ownerProfession} onChange={handleChange} 
        required className="mb-2"/>

        <div style={{display:'flex', gap:'10px'}}>
          <button type="submit" 
              style={{backgroundColor:"green",border:'none',color:'#fff',borderRadius:'5px',padding:"8px"}}>
                {updatingBlog ? "Update Blog" : "Save Blog"}
              </button>
              <button style={{
                backgroundColor:"#BD3A3A",border:'none',
                color:'#fff',borderRadius:'5px',padding:"8px"
              }}
                type="button"
                onClick={() => {setShowForm(false);
                  setUpdatingBlog(null);
                }}
              >
                Cancel
              </button>
        </div>
      </form>
          )}
      

    </div>
  );
};

export default Blogs;
