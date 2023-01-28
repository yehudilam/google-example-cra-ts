import BusRouteStopList from "./BusRouteStopList";

interface BusRouteListTwoWayListProps{
  routeid: number;
}

const BusRouteListTwoWayList = ({
  routeid,
}: BusRouteListTwoWayListProps) => {

  return (
    <div>
      {[1, 2].map(routedir => (
        <BusRouteStopList routeid={routeid} routedir={routedir} />
      ))}
    </div>
  );
};

export default BusRouteListTwoWayList;