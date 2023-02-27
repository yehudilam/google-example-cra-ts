import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useWorker } from "../context/WorkerContext";
import BusRoutePageById from "../pages/BusRoutePageById";
import BusStop from "../pages/BusStop";
import Home from "../pages/Home";

const AppRouter = () => {
  const { dbReady, loadingState } = useWorker();

  if (!dbReady) {
    return (
      <div>
        <div className="flex justify-start items-center">
          <div className="p-4">
            <LoadingSpinner />
          </div>
          <p>Loading... Please wait</p>
        </div>

        {loadingState && (
          <p>{loadingState}</p>
        )}
      </div>
    );
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
