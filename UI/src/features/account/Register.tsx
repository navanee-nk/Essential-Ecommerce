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
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../api/agent";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors, isValid },
    handleSubmit,
    setError,
  } = useForm({ mode: "onTouched" });

  const handleApiErrors = (errors: any) => {
    if (errors.length) {
      errors.array.forEach((err: string) => {
        if (err.includes("Password")) {
          setError("password", { message: err });
        } else if (err.includes("Email")) {
          setError("email", { message: err });
        } else if (err.includes("Username")) {
          setError("username", { message: err });
        }
      });
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
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          agent.Account.register(data)
            .then(() => {
              toast.success("Registration Succesful. You can now login");
              navigate("/login");
            })
            .catch((err: any) => {
              handleApiErrors(err);
            })
        )}
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
          label="Email"
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message?.toString()}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message:
                "Password must contain atleast 8 characters, one letter and one number",
            },
          })}
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
          Register
        </LoadingButton>
        <Grid container>
          <Grid item xs>
            <Link to="/login">{"Already have an account? Sign In"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
