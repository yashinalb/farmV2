import { useState, useEffect } from 'react';
import AddInvoiceComponents from '../../components/addComponents/addInvoiceComponents'; 
import DisplayInvoiceComponents from '../../components/displayComponents/displayInvoiceComponents'; 
import { fetchInvoices, fetchPaymentMethods } from '../../services/apiService';
import Divider from '@mui/material/Divider';
import "./invoice.scss";

const InvoiceCreationForm = () => {
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const fetchAndUpdateInvoices = () => {
    fetchInvoices().then(response => {
      setInvoices(response.data.data);
    }).catch(error => {
      console.error("Error fetching invoices:", error);
    });
  };

  useEffect(() => {
    fetchAndUpdateInvoices();
    fetchPaymentMethods().then(response => {
        const methods = response.data.data;
        setPaymentMethods(methods);
      }).catch(error => {
        console.error("Error fetching payment methods:", error);
      });
  }, []);
  

  return (
    <div>
      <Divider  textAlign="left" sx={{"&::before, &::after": {borderColor: "primary.light",}, m:2, }}>Add Invoice</Divider>
      <AddInvoiceComponents onFormSubmit={fetchAndUpdateInvoices} /> 
      <Divider sx={{"&::before, &::after": {borderColor: "primary.light",}, m:2, }}>Invoices</Divider>
      <DisplayInvoiceComponents invoices={invoices} paymentMethods={paymentMethods} onFetchAndUpdate={fetchAndUpdateInvoices} />
    </div>
  );
};

export default InvoiceCreationForm;