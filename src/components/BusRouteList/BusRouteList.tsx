import React, { useEffect } from "react";
import { useWorker } from "../../context/WorkerContext";
import useSetupWorker from "../../hooks/useSetupworker";
import BusRoute from "./BusRoute";

const BusRouteList = () => {
  const { data: { routes} } = useWorker();

  // useEffect(() => {
    // console.log('route list', routes);
  // }, [routes]);

  console.log('routes', routes);


  return (
    <div>
      <h1>Bus routes: </h1>
      {
        routes && (
          routes?.length !== 0 && (
            <div>
              {routes.map((route: any) => <BusRoute route={route} />)}
            </div>
          )
        )
      }
    </div>
  )
};

export default BusRouteList;
