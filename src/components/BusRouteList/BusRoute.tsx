import { useState } from "react";
import BusRouteListTwoWayList from "../BusRouteStop/BusRouteStopTwoWayList";

const Route = ({ route }: any) => {
  // const [clicked, setClicked] = useState(false);

  return (
    <>
      <div className="flex" 
      // onClick={() => setClicked(true)}
      >
        <div className="text-bold mr-2">{route.routec}</div>
        <div>{route.startc} - {route.destinc}</div>
      </div>
    </>
  )
};

export default Route;
