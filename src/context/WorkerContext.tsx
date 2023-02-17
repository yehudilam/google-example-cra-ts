import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { DB_LOADING, GET_ROUTE_RESULT, GET_ROUTES_RESULT, GET_ROUTE_STOP_RESULT, SEARCH_ROUTE_BY_NAME_RESULT, GET_STOP_ROUTES_RESULT, DB_READY } from "../constants/WorkerMessageTypes";

interface WorkerContextType {
  setUpWorker: () => void,
  terminateWorker: () => void,
  worker?: any;
  dbReady: boolean;
  data: {
    route?: any,
    routes?: any[],
    routeStopMap?: Record<string, any>,
    coor?: Coor,
    stopcs?: string[],
  },
}

export const WorkerContext = createContext<WorkerContextType>({
  // worker: null
  setUpWorker: () => { },
  terminateWorker: () => { },
  dbReady: false,
  data: {},
});

interface Coor {
  lat: number;
  lng: number;
}

export const WorkerProvider = ({
  children
}: {
  children?: ReactNode,
}) => {
  const [worker, setWorker] = useState<any>(undefined);
  // const [workerSettingUp, setWorkerSettingUp] = useState(false);

  const [dbReady, setDbReady] = useState(false);
  const [route, setRoute] = useState<any>(undefined);
  const [routes, setRoutes] = useState([]);
  const [routeStopMap, setRouteStopMap] = useState<Record<string, any>>({});
  const [coor, setCoor] = useState<Coor | undefined>();
  const [stopcs, setStopcs] = useState<string[]>([]);

  const onMessage = useCallback(({ data }: { data: any }) => {
    console.log('worker hook, call back message', data);

    // todo: useReducer
    switch (data.type) {
      case 'log':
        // logHtml(data.payload.cssClass, ...data.payload.args);

        console.log(data.payload.cssClass, ...data.payload.args);
        break;
      case GET_ROUTE_RESULT:
        if (data.error) {
          console.error('GET ROUTE ERROR: ', data.error);
          break;
        }

        setRoute(data.data);

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
        const { routes, coor, stopcs} = data.data;

        setRoutes(routes);
        setCoor(coor);
        setStopcs(stopcs);

        break;
      case DB_READY: 
        setDbReady(true);

        break;
      case DB_LOADING: 
        setDbReady(false);
        break;
      default:
        // logHtml('error', 'Unhandled message:', data.type);
        // console.error(data.payload.cssClass, ...data.payload.args);
        console.log('post message, unknown data type', data);
    }
  }, []);

  useEffect(() => {
    console.log('loading worker');

    const w = new Worker(new URL('../sqlite-worker.js?sqlite3.dir=jswasm', import.meta.url), {
      type: 'module',
    });

    w.onmessage = onMessage;

    setWorker(w);

    return () => {
      console.log('terminating worker');
      setWorker((w: any) => {
        w.terminate();
        return undefined;
      });

    };
  }, [
    onMessage, 
    // workerSettingUp,
  ]);

  const setUpWorker = () => {
    if (!worker) {
      const w = new Worker(new URL('../sqlite-worker.js?sqlite3.dir=jswasm', import.meta.url), {
        type: 'module',
      });

      w.onmessage = onMessage;

      setWorker(w);
    }
  };

  const terminateWorker = () => {
    setWorker(undefined);
    worker.terminate();
  }

  return (
    <WorkerContext.Provider value={{
      worker,
      data: {
        route, routes,
        routeStopMap,
        stopcs, coor,
      },
      dbReady,
      setUpWorker,
      terminateWorker,
    }}>
      {children}
    </WorkerContext.Provider>
  )
}

export const useWorker = () => useContext(WorkerContext);
