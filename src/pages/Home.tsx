import { useEffect } from "react";
import BusRouteList from "../components/BusRouteList/BusRouteList";
import { GET_ROUTES } from "../constants/WorkerMessageTypes";
import { useWorker } from "../context/WorkerContext";

const Home = () => {
  const { worker } = useWorker();

  const clickMe = () => {
    // console.log('click me', worker);
    worker.postMessage({
      type: GET_ROUTES,
    });
  };

  // useEffect(() => {
  //   console.log('routes changed [app.tsx]', routes);
  // }, [routes]);

  return (
    <div>
      route data here:

      <button className="btn btn-blue" onClick={() => {
        console.log('clicking me');
        clickMe();
      }}>Click me</button>

      <BusRouteList />
    </div>
  );
};

export default Home;
