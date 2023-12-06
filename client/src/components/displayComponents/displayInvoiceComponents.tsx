import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Collapse, IconButton, Paper, Button, Select, MenuItem } from '@mui/material';
import { createNewPayment, updatePayment, deletePayment, fetchPaymentStatus, fetchActiveProducts, updateInvoiceDetail, updateInvoice, deleteInvoiceDetailApi, fetchInvoiceDetailsAndUpdateTotal } from '../../services/apiService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPaymentModal from '../../components/modalComponents/EditPaymentModal';
import AddPaymentModal from '../../components/modalComponents/AddPaymentModal';
import AddInvoiceDetailModal from '../../components/modalComponents/AddInvoiceDetailModal';

const DisplayInvoiceComponents = ({ invoices, paymentMethods, onFetchAndUpdate }) => {
  // State to keep track of the invoice detail being edited
  const [editInvoiceDetailId, setEditInvoiceDetailId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  // Function to start editing a specific invoice detail
  const startEditing = (detail, invoiceId) => {
    const productQuantityType = detail.attributes.product_quantity_type.data.attributes.name;
    const matchingQuantityType = products
      .find(product => product.id === detail.attributes.product.data.id)
      ?.quantityTypes
      .find(qt => qt.name === productQuantityType);
    const currentPaymentStatus = paymentStatuses.find(ps => ps.name === detail.attributes.payment_status.data.attributes.name);
    setEditInvoiceDetailId(detail.id);
    setEditFormData({
      productName: detail.attributes.product.data.attributes.name,
      quantity: detail.attributes.quantity,
      pricePerUnit: detail.attributes.price_per_unit,
      editKdv: detail.attributes.kdv,
      editStopaj: detail.attributes.stopaj,
      editKomisyon: detail.attributes.komisyon,
      editProductQuantityType: detail.attributes.product_quantity_type.data.attributes.name,
      editProductId: detail.attributes.product.data.id,
      editProductQuantityType: matchingQuantityType ? productQuantityType : '', // default to empty if not found
      editPaymentStatus: currentPaymentStatus ? currentPaymentStatus.name : '',
      invoiceId: invoiceId,
      // ... other attributes ...
    });
  };

  // Function to handle form changes
  const handleEditFormChange = (e, field) => {
    if (field === "productName") {
      const selectedProduct = products.find(product => product.name === e.target.value);
      setEditFormData({
        ...editFormData,
        [field]: e.target.value,
        editProductId: selectedProduct.id,
        editProductQuantityType: selectedProduct.quantityTypes[0]?.name || '',
      });
    } else {
      setEditFormData({ ...editFormData, [field]: e.target.value });
    }
  };
  const calculateTotalAmount = (invoiceDetails, editedDetailId, editedValues) => {
    return invoiceDetails.reduce((acc, detail) => {
      let pricePerUnit, quantity, kdv, stopaj, komisyon;

      if (detail.id === editedDetailId) {
        // This is the detail being edited, use the edited values
        pricePerUnit = editedValues.pricePerUnit || 0;
        quantity = editedValues.quantity || 0;
        kdv = editedValues.editKdv || 0;
        stopaj = editedValues.editStopaj || 0;
        komisyon = editedValues.editKomisyon || 0;
      } else {
        // This is not the detail being edited, use the existing values
        pricePerUnit = detail.attributes.price_per_unit || 0;
        quantity = detail.attributes.quantity || 0;
        kdv = detail.attributes.kdv || 0;
        stopaj = detail.attributes.stopaj || 0;
        komisyon = detail.attributes.komisyon || 0;
      }

      const basePrice = pricePerUnit * quantity;
      const kdvAmount = basePrice * (kdv / 100);
      const stopajAmount = basePrice * (stopaj / 100);
      const komisyonAmount = basePrice * (komisyon / 100);

      const totalForCurrentProduct = basePrice + kdvAmount - stopajAmount - komisyonAmount;

      return acc + totalForCurrentProduct;
    }, 0);
  };
  // Function to save the edited invoice detail
  const saveEditForm = (id) => {
    // Find the IDs for product, productQuantityType, and paymentStatus
    const productID = products.find(p => p.name === editFormData.productName)?.id;
    const productQuantityTypeID = productID ? productQuantityTypes[productID]?.find(qt => qt.name === editFormData.editProductQuantityType)?.id : null;
    const paymentStatusID = paymentStatuses.find(ps => ps.name === editFormData.editPaymentStatus)?.id;
    if (!productID || !productQuantityTypeID || !paymentStatusID) {
      alert("Invalid product or quantity type or payment status selection");
      return;
    }

    // Prepare the data for the API call
    const invoiceDetailData = {
      data: {
        product: productID,
        product_quantity_type: productQuantityTypeID,
        payment_status: paymentStatusID,
        kdv: editFormData.editKdv,
        komisyon: editFormData.editKomisyon,
        stopaj: editFormData.editStopaj,
        quantity: editFormData.quantity,
        price_per_unit: editFormData.pricePerUnit,
        // ...other fields...
      }
    };
    const invoiceId = editFormData.invoiceId; // This assumes that invoiceId is now being set correctly

    updateInvoiceDetail(id, invoiceDetailData)
      .then(() => {
        const updatedInvoice = invoices.find(inv => inv.id === invoiceId);
        if (updatedInvoice) {
          // Recalculate the total amount for the invoice
          const newTotalAmount = calculateTotalAmount(updatedInvoice.attributes.invoice_details.data, editInvoiceDetailId, editFormData);

          // Prepare the data for updating the invoice total
          const invoiceUpdateData = {
            data: {
              total_amount: newTotalAmount
              // ... any other invoice fields that need updating ...
            }
          };

          // Make an API call to update the invoice with the new total amount
          updateInvoice(invoiceId, invoiceUpdateData)
            .then(response => {
              console.log(`Invoice ID ${invoiceId} updated with new total amount: ${newTotalAmount}`);
              onFetchAndUpdate(); // Refresh the data
            })
            .catch(error => {
              console.error(`Error updating invoice ID ${invoiceId}:`, error);
            });
        } else {
          console.error(`Invoice with ID ${invoiceId} not found.`);
        }

        setEditInvoiceDetailId(null);
      })
      .catch(console.error);
  };


  // Function to cancel editing
  const cancelEdit = () => {
    setEditInvoiceDetailId(null);
  };

  const deleteInvoiceDetail = (id, invoiceId) => {
    const isConfirmedDelete = window.confirm("Are you sure you want to delete this payment?");
    if (isConfirmedDelete) {
      deleteInvoiceDetailApi(id).then(() => {
        fetchInvoiceDetailsAndUpdateTotal(invoiceId)
          .then(response => {
            if (!response.data || !response.data.data || !response.data.data.attributes || !response.data.data.attributes.invoice_details || response.data.data.attributes.invoice_details.data.length === 0) {
              console.error("Invoice details not found in response:", response);
              return;
            }

            const updatedInvoiceDetails = response.data.data.attributes.invoice_details.data;
            const newTotalAmount = calculateTotalAmount(updatedInvoiceDetails);

            // Prepare the data for updating the invoice total
            const invoiceUpdateData = {
              data: {
                total_amount: newTotalAmount
                // ... any other invoice fields that need updating ...
              }
            };

            // Make an API call to update the invoice with the new total amount
            updateInvoice(invoiceId, invoiceUpdateData)
              .then(response => {
                console.log(`Invoice ID ${invoiceId} updated with new total amount: ${newTotalAmount}`);
                onFetchAndUpdate(); // Refresh the data
              })
              .catch(error => {
                console.error(`Error updating invoice ID ${invoiceId}:`, error);
              });
          })
          .catch(error => {
            console.error("Error fetching updated invoice details:", error);
          });
      }).catch(error => {
        console.error("Error deleting payment:", error);
      });
    }
  };
  // End State to keep track of the invoice detail being edited

  // Fetch data for dropdowns
  const [products, setProducts] = useState([]);
  const [productQuantityTypes, setProductQuantityTypes] = useState({}); // Initialize productQuantityTypes
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  useEffect(() => {
    fetchActiveProducts().then(response => {
      const newProductQuantityTypes = {}; // Temporary object to hold the new state
      const productsData = response.data.data.map(product => {
        // Populate newProductQuantityTypes for each product
        newProductQuantityTypes[product.id] = product.attributes.product_quantity_types.data.map(qt => ({
          id: qt.id,
          name: qt.attributes.name
        }));

        return {
          id: product.id,
          name: product.attributes.name,
          quantityTypes: product.attributes.product_quantity_types.data.map(qt => ({
            id: qt.id,
            name: qt.attributes.name
          })),
          // ... other properties ...
        };
      });

      setProducts(productsData);
      setProductQuantityTypes(newProductQuantityTypes); // Update the state with the new productQuantityTypes
    }).catch(console.error);

    fetchPaymentStatus()
      .then(response => {
        const fetchedPaymentStatuses = response.data.data.map(ps => ({
          id: ps.id,
          name: ps.attributes.name
        }));
        setPaymentStatuses(fetchedPaymentStatuses);
      })
      .catch(console.error);
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
  // Add invoice detail
  const [isInvoiceDetailModalOpen, setIsInvoiceDetailModalOpen] = useState(false);
  const [selectedInvoiceDetailId, setSelectedInvoiceDetailId] = useState(null);

  const handleOpenAddInvoiceDetailModal = (invoiceId) => {
    setSelectedInvoiceDetailId(invoiceId);
    setIsInvoiceDetailModalOpen(true);
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
                    <div key={invoice.id}>
                      <Button onClick={() => handleOpenAddPaymentModal(invoice.id)} variant="contained" color="primary">
                        Add Payment
                      </Button>
                    </div>
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
                    <div key={invoice.id}>
                      <Button onClick={() => handleOpenAddInvoiceDetailModal(invoice.id)} variant="contained" color="primary">
                        Add Invoice Detail
                      </Button>
                    </div>
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
                                    {products
                                      .find(product => product.id === editFormData.editProductId) // Find the product being edited
                                      ?.quantityTypes // Get its quantity types
                                      .map((quantityType) => (
                                        <MenuItem key={quantityType.id} value={quantityType.name}>
                                          {quantityType.name}
                                        </MenuItem>
                                      ))}
                                  </Select>

                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={editFormData.editPaymentStatus}
                                    onChange={(e) => handleEditFormChange(e, "editPaymentStatus")}
                                    displayEmpty
                                  >
                                    {paymentStatuses.map((status) => (
                                      <MenuItem key={status.id} value={status.name}>
                                        {status.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
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
                                  <IconButton onClick={() => startEditing(detail, invoice.id)}>
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton onClick={() => deleteInvoiceDetail(detail.id, invoice.id)}>
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
      {isInvoiceDetailModalOpen && (
        <AddInvoiceDetailModal
          open={isInvoiceDetailModalOpen}
          onClose={() => setIsInvoiceDetailModalOpen(false)}
          products={products}
          productQuantityTypes={productQuantityTypes}
          paymentStatuses={paymentStatuses}
        />
      )}
    </Paper>
  );
};

export default DisplayInvoiceComponents;

