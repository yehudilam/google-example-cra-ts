import React from "react";
import { NavLink } from "react-router-dom";
import { useWorker } from "../../context/WorkerContext";
import BusRoute from "./BusRoute";

const BusRouteList = () => {
  const { data: { routes } } = useWorker();

  return (
    <div>
      {(routes?.length ?? 0) > 0 && (
        <h3 className="text-2xl">Bus routes: </h3>
      )}
      <div>
        {routes?.map((route: any) => (
          <NavLink key={route.routeid} to={`/route/id/${route.routeid}`}>
            <BusRoute route={route} />
          </NavLink>
        ))}
      </div>
    </div>
  )
};

export default BusRouteList;
