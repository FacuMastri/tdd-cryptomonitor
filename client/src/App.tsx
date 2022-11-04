import { useState } from "react";

import Login from "./screens/login";
import Dashboard from "./screens/dashboard";

function App() {
  const [jwt, setJwt] = useState<string>();

  return (
    <div>
      <h1>Rostov's Crypto Monitor {jwt}</h1>
      {jwt ? <Dashboard jwt={jwt} /> : <Login setJwt={setJwt} />}
    </div>
  );
}

export default App;
