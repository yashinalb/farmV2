import { useState, useEffect } from 'react';
import AddInvoiceComponents from '../../components/addComponents/addInvoiceComponents'; 
import DisplayInvoiceComponents from '../../components/displayComponents/displayInvoiceComponents'; 
import { fetchInvoices } from '../../services/apiService';
import Divider from '@mui/material/Divider';
import "./invoice.scss";

const InvoiceCreationForm = () => {
  const [invoices, setInvoices] = useState([]);

  const fetchAndUpdateInvoices = () => {
      fetchInvoices().then(response => {
          setInvoices(response.data.data);
      }).catch(error => {
          console.error("Error fetching invoices:", error);
      });
  };

  useEffect(() => {
      fetchAndUpdateInvoices();
  }, []);

  return (
      <div>
      <Divider  textAlign="left" sx={{"&::before, &::after": {borderColor: "primary.light",}, m:2, }}>Add Invoice</Divider>
          <AddInvoiceComponents onFormSubmit={fetchAndUpdateInvoices} /> 
      <Divider sx={{"&::before, &::after": {borderColor: "primary.light",}, m:2, }}>Invoices</Divider>
          <DisplayInvoiceComponents invoices={invoices} />
      </div>
  );
};

export default InvoiceCreationForm;