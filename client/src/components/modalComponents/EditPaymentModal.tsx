import { useState, useEffect } from 'react';
import { Modal, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const EditPaymentModal = ({ payment, paymentMethods, onClose, onSave }) => {
  const paymentMethodId = payment.payment_method?.data?.id?.toString() || '';
  const [editedPayment, setEditedPayment] = useState({
    id: payment.id || '',
    amount: payment.amount || '',
    date: payment.date || '',
    paymentMethod: paymentMethodId, // This should be the id of the payment method
  });

  useEffect(() => {
    // Log to check the initial values
    const paymentMethodId = payment.payment_method?.data?.id?.toString() || '';
    setEditedPayment({
      id: payment.id || '',
      amount: payment.amount || '',
      date: payment.date || '',
      paymentMethod: paymentMethodId, // This should be the id of the payment method
    });
  }, [payment]);

  const handleInputChange = (e) => {
    setEditedPayment({ ...editedPayment, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (event) => {
    console.log('Payment method changed to:', event.target.value);
    setEditedPayment(prevState => ({
      ...prevState,
      paymentMethod: event.target.value // Keep the value as string
    }));
  };

  const handleSubmit = () => {
    let amount = editedPayment.amount;
    if (typeof amount === 'string') {
      amount = parseFloat(amount.replace(/,/g, ''));
    }
  
    const updatedPayment = {
      ...editedPayment,
      amount: amount,
      payment_method: editedPayment.paymentMethod // Change this line
    };
    // Log to check the values before saving
    console.log('Saving payment:', updatedPayment);
  
    onSave(updatedPayment);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', maxWidth: '500px', width: '100%', margin: '20px' }}>
        {/* Add form fields and implement the layout */}
        <TextField
          label="Amount"
          name="amount"
          value={editedPayment.amount}
          onChange={handleInputChange}
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={editedPayment.date}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth>
          <InputLabel id="payment-method-label">Payment Method</InputLabel>
          <Select
            labelId="payment-method-label"
            id="payment-method-select"
            value={editedPayment.paymentMethod}
            label="Payment Method"
            onChange={handlePaymentMethodChange}
          >
            <MenuItem value="">
              <em>Select payment method</em>
            </MenuItem>
            {paymentMethods.map((method) => (
              <MenuItem key={method.id} value={method.id}>
                {method.attributes.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </Modal>
  );
};

export default EditPaymentModal;
