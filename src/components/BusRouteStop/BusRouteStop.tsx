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
    <div className="flex">
      <div>{stopseq}</div>
      <div>
        <NavLink to={`/stop/${stopid}`}>({stopid})</NavLink>
      </div>
      <div>{stopc}</div>
    </div>
    );
};

export default BusRouteStop;
