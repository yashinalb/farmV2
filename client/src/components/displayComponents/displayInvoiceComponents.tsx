const DisplayInvoiceComponents = ({ invoices }) => {
  return (
    <div className="home">
      <h1>Invoices</h1>
      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Buyer</th>
            <th>invoice date</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Payment Status</th>
            <th>Price per unit</th>
            <th>KDV</th>
            <th>Stopaj</th>
            <th>Komisyon</th>
            <th>Product Quantity Type</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            invoice.attributes.invoice_details.data.map((detail) => (
              <tr key={`${invoice.id}-${detail.id}`}>
                <td>{invoice.id}</td>
                <td>{invoice.attributes.buyers_info.data.attributes.name}</td>
                <td>{invoice.attributes.date}</td>
                <td>{detail.attributes.product.data.attributes.name}</td>
                <td>{detail.attributes.quantity}</td>
                <td>{detail.attributes.payment_status.data.attributes.name}</td>
                <td>{detail.attributes.price_per_unit ? detail.attributes.price_per_unit : '-'}</td>
                <td>{detail.attributes.kdv}</td>
                <td>{detail.attributes.stopaj}</td>
                <td>{detail.attributes.komisyon}</td>
                <td>
                  {detail.attributes.product_quantity_type?.data?.attributes?.name 
                    ? detail.attributes.product_quantity_type.data.attributes.name 
                    : 'N/A'}
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayInvoiceComponents;
