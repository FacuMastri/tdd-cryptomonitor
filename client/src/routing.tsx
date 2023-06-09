import { Routes, Route } from "react-router-dom";
import Dashboard from "./screens/dashboard";
import Policies from "./screens/policies";
import Rules from "./screens/rules";
import Variables from "./screens/variables";

type Props = {
  jwt: string;
  admin?: boolean;
};

const Routing = ({ jwt, admin }: Props) => {
  return (
    <Routes>
      <Route index element={<Dashboard jwt={jwt} />} />
      {admin && <Route path="rules" element={<Rules jwt={jwt} />} />}
      {admin && <Route path="variables" element={<Variables jwt={jwt} />} />}
      {admin && <Route path="policies" element={<Policies jwt={jwt} />} />}
    </Routes>
  );
};

export default Routing;
