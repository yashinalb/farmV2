import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Collapse, IconButton, Paper, Button, Select, MenuItem } from '@mui/material';
import { fetchActiveProducts } from '../../services/apiService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPaymentModal from '../../components/modalComponents/EditPaymentModal';
import AddPaymentModal from '../../components/modalComponents/AddPaymentModal';
import { createNewPayment, updatePayment, deletePayment } from '../../services/apiService';

const DisplayInvoiceComponents = ({ invoices, paymentMethods, onFetchAndUpdate }) => {
  // State to keep track of the invoice detail being edited
  const [editInvoiceDetailId, setEditInvoiceDetailId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Function to start editing a specific invoice detail
  const startEditing = (detail) => {
    setEditInvoiceDetailId(detail.id);
    setEditFormData({
      productName: detail.attributes.product.data.attributes.name,
      quantity: detail.attributes.quantity,
      pricePerUnit: detail.attributes.price_per_unit,
      editKdv: detail.attributes.kdv,
      editStopaj: detail.attributes.stopaj,
      editKomisyon: detail.attributes.komisyon,
      editProductQuantityType: detail.attributes.product_quantity_type.data.attributes.name,
      // ... other attributes ...
    });
  };

  // Function to handle form changes
  const handleEditFormChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  // Function to save the edited invoice detail
  const saveEditForm = (id) => {
    // Send data to the server to update...
    updatePayment(id, editFormData)
      .then(() => {
        setEditInvoiceDetailId(null);
        onFetchAndUpdate();
      })
      .catch(console.error);
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditInvoiceDetailId(null);
  };

  const deleteInvoiceDetail = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice detail?")) {
      // Send delete request to the server...
      deletePayment(id)
        .then(() => onFetchAndUpdate())
        .catch(console.error);
    }
  };
  // End State to keep track of the invoice detail being edited

  // Fetch data for dropdowns
  const [products, setProducts] = useState([]);
  const [quantityTypes, setQuantityTypes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  useEffect(() => {
    // Fetch the dropdown data when the component mounts
    fetchActiveProducts().then(response => {
      const productsData = response.data.data.map(product => ({
        id: product.id,
        name: product.attributes.name,
        quantityTypes: product.attributes.product_quantity_types.data.map(qt => ({
          id: qt.id,
          name: qt.attributes.name
        })),
        // Assuming the payment status is related to the product in some way
        // This may need to be fetched from a different endpoint
        paymentStatuses: product.attributes.invoice_details.data.map(ps => ({
          id: ps.id,
          name: ps.attributes.payment_status.data.attributes.name
        })),
      }));

      setProducts(productsData);
      // Extract quantity types and payment statuses if needed
    }).catch(console.error);
  }, []);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const handleOpenAddPaymentModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsPaymentModalOpen(true);
  };
  const handleSaveNewPayment = (paymentData) => {
    // Here you would call the createPayment function
    createNewPayment(paymentData)
      .then(response => {
        // Handle the successful creation of the payment
        console.log("Payment created successfully", response);
        onFetchAndUpdate(); // To refresh the list of payments
      })
      .catch(error => {
        // Handle any errors that occur during the creation
        console.error("Error creating payment:", error);
      });
  };
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

  const handleDelete = (paymentId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this payment?");
    if (isConfirmed) {
      // Call deletePayment with the payment ID
      deletePayment(paymentId).then(() => {
        if (onFetchAndUpdate) {
          onFetchAndUpdate(); // Fetch and update data after deletion
        }
      }).catch(error => {
        console.error("Error deleting payment:", error);
      });
    }
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
                    {invoice.attributes.invoice_details.data.map((detail) => (
                      <div key={invoice.id}>
                        <Button onClick={() => handleOpenAddPaymentModal(invoice.id)} variant="contained" color="primary">
                          Add Payment
                        </Button>
                      </div>
                    ))}
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
                            {editInvoiceDetailId === detail.id ? (
                              <>
                                <TableCell>
                                  <Select
                                    value={editFormData.productName}
                                    onChange={(e) => handleEditFormChange(e, "productName")}
                                  >
                                    {products.map((product) => (
                                      <MenuItem key={product.id} value={product.name}>
                                        {product.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={editFormData.quantity}
                                    onChange={(e) => handleEditFormChange(e, "quantity")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={editFormData.pricePerUnit}
                                    onChange={(e) => handleEditFormChange(e, "pricePerUnit")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={editFormData.editKdv}
                                    onChange={(e) => handleEditFormChange(e, "editKdv")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={editFormData.editStopaj}
                                    onChange={(e) => handleEditFormChange(e, "editStopaj")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={editFormData.editKomisyon}
                                    onChange={(e) => handleEditFormChange(e, "editKomisyon")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={editFormData.editProductQuantityType}
                                    onChange={(e) => handleEditFormChange(e, "editProductQuantityType")}
                                    displayEmpty
                                  >
                                    {products.map((product) =>
                                      product.quantityTypes.map((quantityType) => (
                                        <MenuItem value={quantityType.name}>{quantityType.name}</MenuItem>
                                      ))
                                    )}
                                  </Select>

                                </TableCell>
                                <TableCell>
                                  {detail.attributes.payment_status?.data?.attributes?.name || 'N/A'}
                                </TableCell>
                                <TableCell>
                                  <Button onClick={() => saveEditForm(detail.id)}>Save</Button>
                                  <Button onClick={cancelEdit}>Cancel</Button>
                                </TableCell>
                              </>
                            ) : (
                              <>
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
                                <TableCell>
                                  <IconButton onClick={() => startEditing(detail)}>
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton onClick={() => deleteInvoiceDetail(detail.id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </>
                            )}
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
      {isPaymentModalOpen && (
        <AddPaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSave={handleSaveNewPayment}
          paymentMethods={paymentMethods}
          invoiceId={selectedInvoiceId} // you need to pass the selected invoice ID here
        />
      )}
    </Paper>
  );
};

export default DisplayInvoiceComponents;

