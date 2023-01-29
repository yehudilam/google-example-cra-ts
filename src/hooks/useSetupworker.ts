import { useEffect, useState } from "react";
import { GET_ROUTES_RESULT, GET_ROUTE_STOP_RESULT, GET_STOP_ROUTES_RESULT, SEARCH_ROUTE_BY_NAME_RESULT } from "../constants/WorkerMessageTypes";

const useSetupWorker = () => {
  const [worker, setWorker] = useState<any>(undefined);

  const [routes, setRoutes] = useState([]);
  const [routeStopMap, setRouteStopMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const w = new Worker(new URL('../sqlite-worker.js?sqlite3.dir=jswasm', import.meta.url), {
      type: 'module',
    });
  
    w.onmessage = function ({ data }) {
      console.log('worker hook, call back message', data);

      // todo: useReducer
      switch (data.type) {
        case 'log':
          // logHtml(data.payload.cssClass, ...data.payload.args);
  
          console.log(data.payload.cssClass, ...data.payload.args);
          break;
        case GET_ROUTES_RESULT:
          console.log(GET_ROUTES_RESULT, data.data);
          // todo: print
          setRoutes(data.data);

          break;

        case GET_ROUTE_STOP_RESULT:
          setRouteStopMap((rs) => ({
            ...rs,
            [data.mapKey]: data.data,
          }))

          break;
        case SEARCH_ROUTE_BY_NAME_RESULT:
          setRoutes(data.data);

          break;

        case GET_STOP_ROUTES_RESULT:
          setRoutes(data.data);
          
          break;
        default:
          // logHtml('error', 'Unhandled message:', data.type);
  
          console.error(data.payload.cssClass, ...data.payload.args);
      }
    };

    setWorker(w);

    // return: remove on message(?)
  }, []);

  // useEffect(() => {
  //   console.log('hook for routes change', routes);
  // }, [routes]);

  return {
    worker,
    routes,
    routeStopMap,
    data: {
      routes, routeStopMap,
    },
  };
};

export default useSetupWorker;
