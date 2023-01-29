import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import BusStop from "../pages/BusStop";
import Home from "../pages/Home";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/stop/:stopid" element={<BusStop />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
