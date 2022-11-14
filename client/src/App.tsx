import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import jwt_decode from "jwt-decode";

import Login from "./screens/login";
import Routing from "./routing";
import { BrowserRouter, Link } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Nav({ admin }: { admin?: boolean }) {
  return (
    <nav>
      <h1>Rostov's Crypto Monitor</h1>
      <div>
        <Link to="/">Dashboard</Link>
        {admin ? <Link to="rules">Rules</Link> : ""}
      </div>
    </nav>
  );
}

type UserInfo = { admin?: boolean };
const tokenInfo = (jwt: string): UserInfo => {
  if (!jwt) return {};
  try {
    return jwt_decode(jwt) as UserInfo;
  } catch {
    return {};
  }
};

function App() {
  const [jwt, setJwt] = useState<string>("");
  const { admin } = tokenInfo(jwt);

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <div>
          <Nav admin={admin} />
          {jwt ? (
            <Routing jwt={jwt} admin={admin} />
          ) : (
            <Login setJwt={setJwt} />
          )}
        </div>
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
