import { useState } from "react";
import { loginAPI, checkOk, intoText } from "../util/requests";
import { toast } from "react-toastify";
import { Button, TextField, Typography, InputLabel } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/login.css";

type Props = {
  setJwt: (jwt: string) => void;
};

const validateJwt = (jwt: string) => {};

const Login = ({ setJwt }: Props) => {
  const [processing, setProcessing] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setProcessing(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const user = formData.get("user");
    const password = formData.get("password");

    fetch(loginAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, password }),
    })
      .then(checkOk("Invalid username or password"))
      .then(intoText)
      .then((jwt) => {
        if (!jwt) throw new Error("Failed to login unexpectedly");
        setJwt(jwt);
      })
      .catch((error) => {
        console.log(error.message ?? error);
        toast.error(error.message ?? "Error");
        setProcessing(false);
      });
  };

  return (
    <section>
      <Typography variant="h3">Login</Typography>

      <div className="loginContainer">
        <form onSubmit={onSubmit}>
          <InputLabel htmlFor="user">User</InputLabel>
          <TextField name="user" id="user" disabled={processing} />

          <InputLabel htmlFor="password">Password</InputLabel>
          <TextField
            type="password"
            name="password"
            id="password"
            disabled={processing}
          />

          <Button type="submit" disabled={processing} variant="contained">
            Login
          </Button>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </form>
      </div>
    </section>
  );
};

export default Login;
