import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BusRoute from "../components/BusRouteList/BusRoute";
import BusRouteDetails from "../components/BusRouteList/BusRouteDetails";
import { GET_ROUTE } from "../constants/WorkerMessageTypes";
import { useWorker } from "../context/WorkerContext";

const BusRoutePageById = () => {
  const { routeid } = useParams();
  const { worker, data: { route }} = useWorker();

  useEffect(() => {
    worker.postMessage({
      type: GET_ROUTE,
      variables: {
        routeid,
      }
    })
  }, [routeid, worker]);

  if(!routeid){
    return <div>Error</div>
  }

  return (
    <div>
      <h1>Bus Route ID: {routeid}</h1>
      { route && (<BusRouteDetails route={route} />)}
    </div>
  );
};

export default BusRoutePageById;