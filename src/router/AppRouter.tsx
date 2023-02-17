import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useWorker } from "../context/WorkerContext";
import BusRoutePageById from "../pages/BusRoutePageById";
import BusStop from "../pages/BusStop";
import Home from "../pages/Home";

const AppRouter = () => {
  const { dbReady } = useWorker();

  if(!dbReady){
    return <>Loading</>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/route/id/:routeid" element={<BusRoutePageById />} />
        {/* <Route path="/route/id/:routeName" element={<BusRouteByName routec={routeName} />} /> */}
        <Route path="/stop/:stopid" element={<BusStop />} />

        {/* bus stops near me */}
      </Route>
    </Routes>
  );
}

export default AppRouter;
