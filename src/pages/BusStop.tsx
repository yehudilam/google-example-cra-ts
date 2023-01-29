import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BusRouteList from "../components/BusRouteList/BusRouteList";
import { GET_STOP_ROUTES } from "../constants/WorkerMessageTypes";
import { useWorker } from "../context/WorkerContext";

const BusStop = () => {
  const { stopid } = useParams();
  const { worker, 
    // data: { routes },
   } = useWorker();

   console.log('path variable: stopid', stopid);

  useEffect(() => {
    worker.postMessage({
      type: GET_STOP_ROUTES,
      variables: {
        stopid,
      },
    })
  }, [stopid, worker]);

  return (
    <div>
      <h2>Buses in this stop:</h2>
      {/* todo: stop coor and name */}

      <BusRouteList />
    </div>
  );
};

export default BusStop;
