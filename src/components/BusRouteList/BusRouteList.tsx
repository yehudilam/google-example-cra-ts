import React from "react";
import { NavLink } from "react-router-dom";
import { useWorker } from "../../context/WorkerContext";
import BusRoute from "./BusRoute";

const BusRouteList = () => {
  const { data: { routes } } = useWorker();

  return (
    <div>
      <h1>Bus routes: </h1>
      <div>
        {routes?.map((route: any) => (
          <NavLink to={`/route/id/${route.routeid}`}>
            <BusRoute route={route} />
          </NavLink>
        ))}
      </div>
    </div>
  )
};

export default BusRouteList;
