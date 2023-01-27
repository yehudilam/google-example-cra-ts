import { useEffect, useState } from "react";
import { GET_ROUTES_RESULT } from "../constants/WorkerMessageTypes";

const useSetupWorker = () => {
  const [worker, setWorker] = useState<any>(undefined);

  useEffect(() => {
    const w = new Worker(new URL('../sqlite-worker.js?sqlite3.dir=jswasm', import.meta.url), {
      type: 'module',
    });
  
    w.onmessage = function ({ data }) {
      console.log('worker hook, call back message', data);

      switch (data.type) {
        case 'log':
          // logHtml(data.payload.cssClass, ...data.payload.args);
  
          console.log(data.payload.cssClass, ...data.payload.args);
          break;
        case GET_ROUTES_RESULT:
          // tood: print
          break;
        default:
          // logHtml('error', 'Unhandled message:', data.type);
  
          console.error(data.payload.cssClass, ...data.payload.args);
      }
    };

    setWorker(w);

    // return: remove on message(?)
  }, []);

  return {
    worker,
  };
};

export default useSetupWorker;
