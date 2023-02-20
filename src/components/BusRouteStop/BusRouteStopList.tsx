import { useEffect } from "react";
import { GET_ROUTE_STOPS } from "../../constants/WorkerMessageTypes";
import { useWorker } from "../../context/WorkerContext";
import { BusRouteStopType } from "../../model/BusRouteStopType";
import BusRouteStop from "./BusRouteStop";

interface BusRouteStopListProps{
  routeid: number, routedir: number
}

const BusRouteStopList = ({
  routeid, routedir
}: BusRouteStopListProps) => {
  const { 
    worker,
    data: { routeStopMap }
   } = useWorker();

  useEffect(() => {
    worker.postMessage({
      type: GET_ROUTE_STOPS,
      variables: {routeid, routedir},
    });
  }, [routeid, routedir, worker]);
  
  const routeStops = routeStopMap?.[`${routeid}-${routedir}`];

  if(!routeStops){
    return (
      <div>No route stops</div>
    )
  }
  
  return (
    <div>
      {routeStops.map((rs: any) => (
        <BusRouteStop key={`${rs.stopid}-${rs.stopseq}-${rs.routedir}`} routeStop={rs as BusRouteStopType} />
      ))}
    </div>
  );
};

export default BusRouteStopList;