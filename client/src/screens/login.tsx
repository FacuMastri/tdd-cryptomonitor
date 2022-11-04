import { useState } from "react";
import { loginAPI, checkOk, intoText } from "../util/requests";
import { toast } from "react-toastify";

type Props = {
  setJwt: (jwt: string) => void;
};

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
      <h1>Login</h1>

      <div>
        <form onSubmit={onSubmit}>
          <label htmlFor="user">User</label>
          <input name="user" id="user" disabled={processing} />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            disabled={processing}
          />

          <button type="submit" disabled={processing}>
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
