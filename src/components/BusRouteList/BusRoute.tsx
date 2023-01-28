import { useState } from "react";
import BusRouteListTwoWayList from "../BusRouteStop/BusRouteStopTwoWayList";

const Route = ({ route }: any) => {
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <div className="flex" onClick={() => setClicked(true)}>
        <div>{route.routec}</div>
        <div>{route.startc}</div>
        <div>{route.destinc}</div>
      </div>
      
      {/* loading indicator */}
      {clicked && (
        <BusRouteListTwoWayList routeid={route.routeid} />
      )}
    </>
  )
};

export default Route;
