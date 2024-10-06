import { Button, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container component={Paper} sx={{height:400}}>
      <Typography gutterBottom variant="h3">Oops - The Page you're looking for is not found</Typography>
      <Button fullWidth component={Link} to='/catalog'>Go to Shop</Button>
    </Container>
  )
};

export default NotFound;
