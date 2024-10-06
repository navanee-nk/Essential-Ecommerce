import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import agent from "../../api/agent";
import { useState } from "react";

const AboutPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const getValidationErrors = () => {
    agent.TestingErrors.getValidationError()
      .then(() => console.log("should not see this"))
      .catch((err) => {
        setValidationErrors(err);
      });
  };
  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Errors For Testing Purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestingErrors.get400Error().catch((err) => console.log(err))
          }
        >
          Test 400 Error
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestingErrors.get401Error().catch((err) => console.log(err))
          }
        >
          Test 401 Error
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestingErrors.get404Error().catch((err) => console.log(err))
          }
        >
          Test 404 Error
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestingErrors.get500Error().catch((err) => console.log(err))
          }
        >
          Test 500 Error
        </Button>
        <Button variant="contained" onClick={getValidationErrors}>
          Test Validation Error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((err) => (
              <ListItem key={err}>
                <ListItemText>{err}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
};

export default AboutPage;
