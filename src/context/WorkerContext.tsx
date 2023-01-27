import { createContext, useContext } from "react";

interface WorkerContextType {
  worker?: any
}

export const WorkerContext = createContext<WorkerContextType>({
  // worker: null
});

export const useWorker = () => useContext(WorkerContext);
