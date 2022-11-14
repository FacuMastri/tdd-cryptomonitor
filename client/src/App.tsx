import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Login from "./screens/login";
import Routing from "./routing";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [jwt, setJwt] = useState<string>();

  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <h1>Rostov's Crypto Monitor</h1>
        {jwt ? <Routing jwt={jwt} /> : <Login setJwt={setJwt} />}
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
