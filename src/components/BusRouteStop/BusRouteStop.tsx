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
      <div>({stopid})</div>
      <div>{stopc}</div>
    </div>
    );
};

export default BusRouteStop;
