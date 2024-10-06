import { LockOutlined } from "@mui/icons-material";
import {
  Typography,
  Container,
  TextField,
  Grid,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../store/counterStore";
import { signInUser } from "./accountSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  console.log(location.state?.from);
  const {
    register,
    formState: { isSubmitting, errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onTouched" });
  const submitForm = async (data: FieldValues) => {
    try {
      await dispatch(signInUser(data));
      navigate(location.state?.from?.pathname || "/catalog");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        p: 4,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          autoFocus
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors?.username?.message?.toString()}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors?.password?.message?.toString()}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          loading={isSubmitting}
          disabled={!isValid}
        >
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item xs>
            <Link to="/register">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
