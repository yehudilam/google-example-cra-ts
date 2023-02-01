import { useState } from "react";
import BusRouteList from "../components/BusRouteList/BusRouteList";
import { GET_ROUTES, SEARCH_ROUTE_BY_NAME } from "../constants/WorkerMessageTypes";
import { useWorker } from "../context/WorkerContext";

const Home = () => {
  const { worker } = useWorker();
  const [routec, setRoutec] = useState('');

  const start = () => {
    worker.postMessage({
      type: GET_ROUTES,
    });
  };

  const searchRoute = () => {
    worker.postMessage({
      type: SEARCH_ROUTE_BY_NAME,
      variables: {
        routec,
      }
    })
  };

  return (
    <div>
      <div className="flex">
        <div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Route name"
            onChange={e => {
              setRoutec(e?.target?.value ?? "");
            }}
          />
        </div>

        <button
          className="px-6 py-2 rounded bg-sky-400 hover:bg-sky-500 text-sky-100"
          onClick={searchRoute}
        >Search</button>
      </div>

      <button
        className="px-6 py-2 rounded bg-sky-400 hover:bg-sky-500 text-sky-100"
        onClick={start}
      >start</button>

      <BusRouteList />
    </div>
  );
};

export default Home;
