import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import jwt_decode from "jwt-decode";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./screens/login";
import Routing from "./routing";
import { BrowserRouter, Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import BasicMenu from "./util/menu";

const JWT_STORAGE_KEY = "jwt";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

type NavProps = {
  admin?: boolean;
  user?: string;
  logout: () => void;
};
function Nav({ admin, user, logout }: NavProps) {
  return (
    <nav>
      <h1>Rostov's Crypto Monitor</h1>
      {user && (
        <div>
          <div>
            <Link to="/">Dashboard</Link>
            {admin ? <Link to="rules">Rules</Link> : ""}
            {admin ? <Link to="variables">Variables</Link> : ""}
          </div>
          <BasicMenu
            items={[
              { label: user, onClick: () => {} },
              { label: "Logout", onClick: logout },
            ]}
          >
            <Avatar />
          </BasicMenu>
        </div>
      )}
    </nav>
  );
}

type UserInfo = { admin?: boolean; user?: string; exp?: number };

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
  const { user, admin } = tokenInfo(jwt);
  const logout = () => {
    setJwt("");
  };

  useEffect(() => {
    const jwt = localStorage.getItem(JWT_STORAGE_KEY);
    // "exp" está en segundos, Date.now() en milisegundos
    if (jwt && tokenInfo(jwt).exp! > Date.now() / 1000) {
      setJwt(jwt);
    }
  });

  return (
    <GoogleOAuthProvider clientId="283435392885-4q2ph3d1v2nuf98str251pvd1vg5elmq.apps.googleusercontent.com">
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <div>
            <Nav admin={admin} user={user} logout={logout} />
            {jwt ? (
              <Routing jwt={jwt} admin={admin} />
            ) : (
              <Login
                setJwt={(jwt) => {
                  localStorage.setItem(JWT_STORAGE_KEY, jwt);
                  setJwt(jwt);
                }}
              />
            )}
          </div>
        </BrowserRouter>
        <ToastContainer />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
