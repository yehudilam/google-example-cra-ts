import BusRouteListTwoWayList from "../BusRouteStop/BusRouteStopTwoWayList";

const BusRouteDetails = ({ route }: any) => {

  return (
    <>
      <div className="flex"
      >
        <h2 className="mb-4 text-xl">
          <span className="font-bold mr-2">{route.routec}</span>
          <span>{route.startc} - {route.destinc}</span>
        </h2>
      </div>

      <BusRouteListTwoWayList routeid={route.routeid} />
    </>
  )
};

export default BusRouteDetails;
