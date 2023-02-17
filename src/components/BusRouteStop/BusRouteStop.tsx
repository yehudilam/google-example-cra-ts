import { NavLink } from "react-router-dom";
import { BusRouteStopType } from "../../model/BusRouteStopType";

// interface BusRouteStopProps{
//   stopseq: number;
//   stopc: string;
//   stopid: number;
// }

const BusRouteStop = ({
  routeStop
}: {
  routeStop: BusRouteStopType,
}) => {
  const { stopseq, stopid, stopc} = routeStop;

  return (
    <NavLink to={`/stop/${stopid}`} className="flex py-1 px-2">
      <p className="mr-2">{stopseq}</p>
      <p>{stopc}</p>
    </NavLink>
    );
};

export default BusRouteStop;
