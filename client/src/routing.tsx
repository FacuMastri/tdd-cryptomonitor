import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/dashboard";
import Rules from "./screens/rules";

type Props = {
  jwt: string;
};

const Routing = ({ jwt }: Props) => {
    return (
      <BrowserRouter>
        <Routes>
            <Route index element={<Dashboard jwt={jwt}/>} />
            <Route path="rules" element={<Rules jwt={jwt}/>} />
        </Routes>
      </BrowserRouter>
    );
  };
  
  export default Routing;