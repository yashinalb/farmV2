import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DisplayProductComponents = ({ products }) => {
    return (
        <div>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={12} md={6} lg={4} key={product.id}>
                        <Accordion key={product.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${product.id}-content`}
                                id={`panel${product.id}-header`}
                            >
                                <Typography>{product.attributes.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography component={'span'}>
                                    {product.attributes.product_category?.data && (
                                        <p>Category: {product.attributes.product_category.data.attributes.name}</p>
                                    )}
                                    {product.attributes.product_quantity_types?.data.length > 0 &&
                                        product.attributes.product_quantity_types.data.map((quantityType) => (
                                            <p key={quantityType.id}>Quantity Type: {quantityType.attributes.name}</p>
                                        ))}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default DisplayProductComponents;

