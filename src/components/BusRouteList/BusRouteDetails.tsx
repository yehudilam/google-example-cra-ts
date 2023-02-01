import BusRouteListTwoWayList from "../BusRouteStop/BusRouteStopTwoWayList";

const BusRouteDetails = ({ route }: any) => {

  return (
    <>
      <div className="flex"
      // onClick={() => setClicked(true)}
      >
        <div className="text-bold mr-2">{route.routec}</div>
        <div>{route.startc} - {route.destinc}</div>
      </div>

      <BusRouteListTwoWayList routeid={route.routeid} />
    </>
  )
};

export default BusRouteDetails;
