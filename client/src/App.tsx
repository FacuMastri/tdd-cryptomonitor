import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./screens/login";
import Dashboard from "./screens/dashboard";

function App() {
  const [jwt, setJwt] = useState<string>();

  return (
    <div>
      <h1>Rostov's Crypto Monitor</h1>
      {jwt ? <Dashboard jwt={jwt} /> : <Login setJwt={setJwt} />}
      <ToastContainer />
    </div>
  );
}

export default App;
