import BusRouteStopList from "./BusRouteStopList";

interface BusRouteListTwoWayListProps{
  routeid: number;
}

const BusRouteListTwoWayList = ({
  routeid,
}: BusRouteListTwoWayListProps) => {

  return (
    <div className="flex">
      {[1, 2].map(routedir => (
        <BusRouteStopList key={`${routeid}-${routedir}`} routeid={routeid} routedir={routedir} />
      ))}
    </div>
  );
};

export default BusRouteListTwoWayList;