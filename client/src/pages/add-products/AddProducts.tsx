import { useState, useEffect } from 'react';
import { fetchProducts } from '../../services/apiService';
import AddProductComponents from '../../components/addComponents/addProductComponents';
import DisplayProductComponents from '../../components/displayComponents/displayProductComponents';
import Divider from '@mui/material/Divider';

const AddDataForm = () => {
  const [products, setProducts] = useState([]);

  const fetchAndUpdateProducts = () => {
    fetchProducts().then(response => {
      setProducts(response.data.data);
    }).catch(error => {
      console.error("Error fetching invoices:", error);
    });
  };
  useEffect(() => {
    fetchAndUpdateProducts();
  }, []);

  return (
    <div>
      <Divider textAlign="left" sx={{"&::before, &::after": {borderColor: "secondary.light",}, m:2, }}>Add Products</Divider>
      <AddProductComponents onFormSubmitProduct={fetchAndUpdateProducts} />
      <Divider sx={{"&::before, &::after": {borderColor: "secondary.light",}, m:2, }}>Products</Divider>
      <DisplayProductComponents products={products} />
    </div>
  );
};

export default AddDataForm;
