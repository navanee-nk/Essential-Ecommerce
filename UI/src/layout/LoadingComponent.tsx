import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props {
  message?: string;
}

const LoadingComponent = ({ message = "Loading..." }: Props) => {
  return (
    <Backdrop open={true} invisible={true}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress size={100} color="secondary"></CircularProgress>
        <Typography
          variant="h4"
          sx={{ justifyContent: "center", position: "fixed", top: "60%" }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingComponent;
