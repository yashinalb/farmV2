import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DisplayBuyerComponents = ({ buyers }) => {
    return (
        <div>
            <Grid container spacing={2}>
                {buyers.map((buyer) => (
                    <Grid item xs={12} md={6} lg={4} key={buyer.id}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${buyer.id}-content`}
                                id={`panel${buyer.id}-header`}
                            >
                                <Typography>{buyer.attributes.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <p>Type: {buyer.attributes.buyer_type.data.attributes.name}</p>
                                    <p>KDV: {buyer.attributes.kdv}</p>
                                    <p>Stopaj: {buyer.attributes.stopaj}</p>
                                    <p>Komisyon: {buyer.attributes.komisyon}</p>
                                    <p>Number: {buyer.attributes.contact_number}</p>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default DisplayBuyerComponents;
