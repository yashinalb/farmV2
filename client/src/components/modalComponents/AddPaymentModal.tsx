import { useState } from 'react';
import { Modal, TextField, Button, Select, MenuItem, Grid } from '@mui/material';

const AddPaymentModal = ({ open, onClose, onSave, paymentMethods, invoiceId }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    date: '',
    payment_method: ''

  });

  const handleInputChange = (e) => {
    setPaymentData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };


  const handleSubmit = () => {
    if (!paymentData.amount || !invoiceId) {
      console.error("All required fields must be filled");
      return;
    }

    const formattedPaymentData = {
      amount: parseFloat(paymentData.amount),
      date: paymentData.date, // You can modify this as needed
      payment_method: parseInt(paymentData.payment_method, 10), // You need to handle selection of payment method
      invoice: invoiceId,
    };

    onSave(formattedPaymentData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container spacing={2} style={{ background: 'white', padding: '20px', borderRadius: '10px', maxWidth: '500px', width: '100%', margin: '20px' }}>
        {/* Amount Input */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="amount"
            label="Amount"
            value={paymentData.amount}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Date Input */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="date"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={paymentData.date}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Payment Method Selector */}
        <Grid item xs={12}>
          <Select
            fullWidth
            name="payment_method"
            value={paymentData.payment_method}
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Payment Method
            </MenuItem>
            {paymentMethods.map((method) => (
              <MenuItem key={method.id} value={method.id}>
                {method.attributes.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {/* Submit Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            Add Payment
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );

};

export default AddPaymentModal;