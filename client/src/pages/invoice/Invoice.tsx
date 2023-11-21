import { useState, useEffect } from 'react';
import AddInvoiceComponents from '../../components/addComponents/addInvoiceComponents'; 
import DisplayInvoiceComponents from '../../components/displayComponents/displayInvoiceComponents'; 
import { fetchInvoices } from '../../services/apiService';
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
          <AddInvoiceComponents onFormSubmit={fetchAndUpdateInvoices} /> 
          <DisplayInvoiceComponents invoices={invoices} />
      </div>
  );
};

export default InvoiceCreationForm;