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
                                <Typography component="div"> {/* Change the root component to div */}
                                    Type: {buyer.attributes.buyer_type.data.attributes.name}<br />
                                    KDV: {buyer.attributes.kdv}<br />
                                    Stopaj: {buyer.attributes.stopaj}<br />
                                    Komisyon: {buyer.attributes.komisyon}<br />
                                    Number: {buyer.attributes.contact_number}
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
