import { createContext, useContext } from "react";

interface WorkerContextType {
  worker?: any
  data: {
    route?: any,
    routes?: any[],
    routeStopMap?: Record<string, any>,
  },
}

export const WorkerContext = createContext<WorkerContextType>({
  // worker: null
  data: {},
});

export const useWorker = () => useContext(WorkerContext);
