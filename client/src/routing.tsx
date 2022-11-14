import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/dashboard";
import Login from "./screens/login";
import Rules from "./screens/rules";

type Props = {
  jwt: string;
  setJwt: (jwt: string) => void;
};

const Routing = ({ jwt, setJwt }: Props) => {
  return jwt ? (
    <Routes>
      <Route index element={<Dashboard jwt={jwt} />} />
      <Route path="rules" element={<Rules jwt={jwt} />} />
    </Routes>
  ) : (
    <Login setJwt={setJwt} />
  );
};

export default Routing;
