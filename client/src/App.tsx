import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Login from "./screens/login";
import Routing from "./routing";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Dashboard from "./screens/dashboard";
import Rules from "./screens/rules";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Nav() {
  return (
    <nav>
      <h1>Rostov's Crypto Monitor</h1>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="rules">Rules</Link>
      </div>
    </nav>
  );
}

function App() {
  const [jwt, setJwt] = useState<string>("");

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <div>
          <Nav />
          <Routing jwt={jwt} setJwt={setJwt} />
        </div>
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
