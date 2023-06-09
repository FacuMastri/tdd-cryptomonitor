import { useState } from "react";
import { loginAPI, checkOk, intoText } from "../util/requests";
import { toast } from "react-toastify";
import { Button, TextField, Typography, InputLabel } from "@mui/material";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import "../styles/login.css";
import { postData } from "../util/fetch";

type Props = {
  setJwt: (jwt: string) => void;
};

const validateJwt = (jwt: string) => {};

const Login = ({ setJwt }: Props) => {
  const [processing, setProcessing] = useState(false);
  const postLogin = postData(loginAPI, undefined, "Error logging in");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setProcessing(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const user = formData.get("user");
    const password = formData.get("password");

    let jwt = await postLogin({ user, password });
    if (jwt) setJwt(jwt);
    else setProcessing(false);
  };

  const onGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setProcessing(true);
    const { credential, clientId } = credentialResponse;
    let jwt = await postLogin({ google: credential, clientId });
    setJwt(jwt);
    if (jwt) setJwt(jwt);
    else setProcessing(false);
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

          {!processing && (
            <GoogleLogin
              onSuccess={onGoogleLogin}
              onError={() => toast("Login Failed")}
            />
          )}
        </form>
      </div>
    </section>
  );
};

export default Login;
