import { Routes, Route } from "react-router-dom";
import Dashboard from "./screens/dashboard";
import Rules from "./screens/rules";

type Props = {
  jwt: string;
  admin?: boolean;
};

const Routing = ({ jwt, admin }: Props) => {
  return (
    <Routes>
      <Route index element={<Dashboard jwt={jwt} />} />
      {admin && <Route path="rules" element={<Rules jwt={jwt} />} />}
    </Routes>
  );
};

export default Routing;
