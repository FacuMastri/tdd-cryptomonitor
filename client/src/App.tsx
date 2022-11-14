import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import jwt_decode from "jwt-decode";

import Login from "./screens/login";
import Routing from "./routing";
import { BrowserRouter, Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import BasicMenu from "./util/menu";

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

type UserInfo = { admin?: boolean; user?: string };
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

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <div>
          <Nav admin={admin} user={user} logout={logout} />
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
