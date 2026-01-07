import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    productTitle: "",
    productNumber: "",
    productImage: [],
    productPrice: "",
    productRating: [],
    numberInStock: "",
    categoryId: "",
  });

  const token = localStorage.getItem("adminToken");

// fetching products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/byc-stores/product/get-all-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

// fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/byc-stores/category/get-all-categories"
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [token]);

  const arrayFields = ["productImage", "productRating"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: arrayFields.includes(name) ? [value] : value,
    });
  };

// Update/create products
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    try {
      if (updatingProduct) {
        await axios.put(
          `http://localhost:3001/api/byc-stores/product/update-product/${updatingProduct._id}`,
          formData,
          {
            headers: { "x-auth-token": token },
          }
        );
         Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully",
      });
      } else {
        // Create
        await axios.post(
          "http://localhost:3001/api/byc-stores/product/add-new-product",
          formData,
          {
            headers: { "x-auth-token": token },
          }
        );
        Swal.fire({
        icon: "success",
        title: "Created!",
        text: "Product added successfully",
      });
      }

      setShowForm(false);
      setUpdatingProduct(null);
      updateForm();
      fetchProducts();
    } catch (err) {
      Swal.fire({
      icon: "error",
      title: "Action Failed",
      text: err.response?.data?.message || "Something went wrong",
    });
    }
  };

  const handleUpdate = (product) => {
    setUpdatingProduct(product);
    setShowForm(true);

    setFormData({
      productName: product.productName || "",
      productTitle: product.productTitle || "",
      productNumber: product.productNumber || "",
      productImage: product.productImage || [],
      productPrice: product.productPrice || "",
      productRating: product.productRating || [],
      numberInStock: product.numberInStock || "",
      categoryId: product.category?._id || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
    title: "Delete Product?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#BD3A3A",
    cancelButtonColor: "#999",
    confirmButtonText: "Yes, delete it!",
  });

    if (!confirmDelete.isConfirmed) return;

    try {
      await axios.delete(
        `http://localhost:3001/api/byc-stores/product/delete-product/${id}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Product has been deleted successfully.",
    });


      fetchProducts();
    } catch (err) {
      Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: err.response?.data?.message || "Something went wrong",
    });
    }
  };

// Update form
  const updateForm = () => {
    setFormData({
      productName: "",
      productTitle: "",
      productNumber: "",
      productImage: [],
      productPrice: "",
      productRating: [],
      numberInStock: "",
      categoryId: "",
    });
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="products-page">
      <div className="d-flex justify-content-between m-3">
      <h2>Products</h2>
        <button onClick={() => {
          setShowForm(true);
          setUpdatingProduct(null);
          updateForm();
        }}
        style={{
          background: "#BD3A3A",
          border: "none",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          marginBottom:'10px',
        }}
      >
        Create Product
      </button>
      </div>

      {showForm && (
        <div className="product-form-wrapper">
          <form onSubmit={handleSaveProduct} className="product-form">
            <h3>{updatingProduct ? "Update Product" : "Add New Product"}</h3>

            <input type="text" name="productName" placeholder="Product Name"
              value={formData.productName} onChange={handleChange} required className="mb-2" />
            <input type="text" name="productTitle" placeholder="Product Title" value={formData.productTitle}
              onChange={handleChange} required className="mb-2"/>
            <input type="text" name="productNumber" placeholder="Product Number"
              value={formData.productNumber} onChange={handleChange} required className="mb-2"/>
            <input type="text" name="productImage" placeholder="Product Image URL"
              value={formData.productImage[0] || ""} onChange={handleChange} required className="mb-2"/>
            <input type="text" name="productPrice" placeholder="Product Price"
              value={formData.productPrice} onChange={handleChange} required className="mb-2"/>
            <input type="text" name="productRating" placeholder="Product Rating"
              value={formData.productRating[0] || ""} onChange={handleChange} className="mb-2"/>
            <input type="text" name="numberInStock" placeholder="Number in Stock" value={formData.numberInStock}
              onChange={handleChange} required className="mb-2"/>

            <select name="categoryId" value={formData.categoryId} onChange={handleChange}
              required className="mb-2">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap:'10px' }}>
              <button type="submit" 
               style={{
                backgroundColor:"green",border:'none',
                color:'#fff',borderRadius:'5px',padding:"8px"
                }}>
                {updatingProduct ? "Update Product" : "Save Product"}
              </button>
              <button style={{
                backgroundColor:"#BD3A3A",border:'none',
                color:'#fff',borderRadius:'5px',padding:"8px"
              }} type="button" onClick={() => {
                  setShowForm(false);
                  setUpdatingProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price (₦)</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  src={product.productImage?.[0]}
                  alt={product.productName}
                  width="50"
                />
              </td>
              <td>{product.productName}</td>
              <td>{product.productPrice}</td>
              <td>{product.category?.name}</td>
              <td>{product.numberInStock}</td>
              <td>
                  <div style={{ display: "flex", gap:'10px' }}>
                  <button style={{ 
                    color: "#fff",backgroundColor:'limegreen',
                    border:'none',padding:'8px',borderRadius:'5px' 
                  }}
                 onClick={() => handleUpdate(product)}>Update
                 </button>
                <button style={{ 
                  color: "#fff",backgroundColor:'#BD3A3A',
                  border:'none',padding:'8px',borderRadius:'5px' 
                }} onClick={() => handleDelete(product._id)}
                > Delete
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
