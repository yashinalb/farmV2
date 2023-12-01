import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Collapse, IconButton, Paper } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPaymentModal from '../../components/modalComponents/EditPaymentModal';
import { updatePayment } from '../../services/apiService';

const DisplayInvoiceComponents = ({ invoices, paymentMethods, onFetchAndUpdate }) => {
  const [open, setOpen] = useState({});

  const handleOpen = (id) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const [editingPayment, setEditingPayment] = useState(null);


  const handleEdit = (paymentDetails) => {
    const paymentDataForEdit = {
      id: paymentDetails.id,
      ...paymentDetails.attributes,
      paymentMethod: paymentDetails.attributes.payment_method.data.id,  // Change this line
    };
    setEditingPayment(paymentDataForEdit);
  };


  const saveEditedPayment = (updatedPayment) => {
    // Extract the ID from the updatedPayment object
    const paymentId = updatedPayment.id;
    if (paymentId) {
      // Call updatePayment with the extracted ID and the updated payment data
      updatePayment(paymentId, { data: updatedPayment }).then(() => {
        if (onFetchAndUpdate) {
          onFetchAndUpdate();
        }
      }).catch(error => {
        console.error("Error updating payment:", error);
      });
    } else {
      console.error("Payment ID is undefined", updatedPayment);
    }
  };

  return (
    <Paper sx={{ background: '#fff' }}>
      <Table>
        <TableHead>
          <TableRow>
            <th />
            {/* <th>Invoice ID</th>  */}
            <th>Buyer</th>
            <th>Invoice Date</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <React.Fragment key={invoice.id}>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => handleOpen(invoice.id)}
                  >
                    {open[invoice.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                {/* <TableCell>{invoice.id}</TableCell> */}
                <TableCell>{invoice.attributes.buyers_info.data.attributes.name}</TableCell>
                <TableCell>{invoice.attributes.date}</TableCell>
                <TableCell>{invoice.attributes.total_amount}</TableCell>
                <TableCell>
                  {invoice.attributes.invoice_details.data.length > 0
                    ? invoice.attributes.invoice_details.data[0].attributes.payment_status.data.attributes.name
                    : 'N/A'}
                </TableCell>

              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open[invoice.id]} timeout="auto" unmountOnExit>
                    {/* Payment Details Table */}
                    <Table size="small" aria-label="payments" sx={{ backgroundColor: '#f0f8ff', margin: 1, borderRadius: 4 }}>
                      <TableHead>
                        <TableRow>
                          <th>Payment Method</th>
                          <th>Payment Date</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoice.attributes.payments_tables.data.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.attributes.payment_method.data.attributes.name}</TableCell>
                            <TableCell>{payment.attributes.date}</TableCell>
                            <TableCell>{payment.attributes.amount}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleEdit(payment, 'payment')}>
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(payment.id, 'payment')}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {/* Invoice Details Table */}
                    <Table size="small" aria-label="invoice details" style={{ marginTop: '20px' }}>
                      <TableHead>
                        <TableRow>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price per unit</th>
                          <th>KDV</th>
                          <th>Stopaj</th>
                          <th>Komisyon</th>
                          <th>Product Quantity Type</th>
                          <th>Payment Status</th>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoice.attributes.invoice_details.data.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell>{detail.attributes.product.data.attributes.name}</TableCell>
                            <TableCell>{detail.attributes.quantity}</TableCell>
                            <TableCell>{detail.attributes.price_per_unit}</TableCell>
                            <TableCell>{detail.attributes.kdv}</TableCell>
                            <TableCell>{detail.attributes.stopaj}</TableCell>
                            <TableCell>{detail.attributes.komisyon}</TableCell>
                            <TableCell>
                              {detail.attributes.product_quantity_type?.data?.attributes?.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {detail.attributes.payment_status?.data?.attributes?.name || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {editingPayment && (
      <EditPaymentModal
        payment={editingPayment}
        paymentMethods={paymentMethods}
        onSave={saveEditedPayment} // Pass saveEditedPayment as a prop
        onClose={() => setEditingPayment(null)}
      />
    )}

    </Paper>
  );
};

export default DisplayInvoiceComponents;

