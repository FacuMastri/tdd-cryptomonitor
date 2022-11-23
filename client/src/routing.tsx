import { Routes, Route } from "react-router-dom";
import Dashboard from "./screens/dashboard";
import Politics from "./screens/politics";
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
      {admin && <Route path="politics" element={<Politics jwt={jwt} />} />}
    </Routes>
  );
};

export default Routing;
