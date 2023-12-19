import { useState, useEffect } from 'react';
import { fetchBuyers } from '../../services/apiService';
import AddBuyerComponents from '../../components/addComponents/addBuyerComponents';
import DisplayBuyerComponents from '../../components/displayComponents/displayBuyerComponents';
import Divider from '@mui/material/Divider';

const AddDataForm = () => {
  const [buyers, setBuyers] = useState([]);
  const fetchAndUpdateBuyers = () => {
    fetchBuyers().then(response => {
      setBuyers(response.data.data);
    }).catch(error => {
      console.error("Error fetching invoices:", error);
    });
  };

  useEffect(() => {
    fetchAndUpdateBuyers();
  }, []);

  return (
    <div>
      <Divider  textAlign="left" sx={{"&::before, &::after": {borderColor: "primary.light",}, m:2, }}>Add Buyers</Divider>
      <AddBuyerComponents onFormSubmit={fetchAndUpdateBuyers} />
      <Divider sx={{"&::before, &::after": {borderColor: "primary.light",}, m:2, }}>Buyers</Divider>
      <DisplayBuyerComponents buyers={buyers} />
    </div>
  );
};

export default AddDataForm;
