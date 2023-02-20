import { NavLink, Outlet } from "react-router-dom";
import { CLEAR_DATA, DATA_COUNT, FETCH_TRANSPORT_DATA, LIST_FILES } from "../../constants/WorkerMessageTypes";
import { useWorker } from "../../context/WorkerContext";

const Layout = () => {
  const { worker, setUpWorker, dataNotLoaded } = useWorker();

  const listFiles = () => {
    worker?.postMessage({
      type: LIST_FILES,
    });
  }

  const fetchTransportData = () => {
    worker?.postMessage({
      type: FETCH_TRANSPORT_DATA,
    });
  }

  const getDataCount = () => {
    worker?.postMessage({
      type: DATA_COUNT
    });
  }

  const clearData = () => {
    worker?.postMessage({
      type: CLEAR_DATA,
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-200 h-16 flex justify-start items-center">
        <h1 className="ml-8 text-xl font-bold">Sqlite WASM bus route data example</h1>
      </div>

      <div className="flex flex-1">
        <nav className="p-4 border-r border-grey-200">
          <ul>
            <li><NavLink to="/">Home</NavLink></li>

            {worker ? (
              <>
                <li>
                  <button onClick={listFiles}>List Files</button>
                </li>
                <li>
                  <button onClick={fetchTransportData}>Fetch data</button>
                </li>
                <li>
                  <button onClick={getDataCount}>Data count</button>
                </li>
                <li>
                  <button onClick={clearData}>Clear data</button>
                </li>
              </>
            ) : (
              <li>
                {/* todo manually start loading worker: */}
                <button onClick={setUpWorker}>Load worker</button>
              </li>
            )}

          </ul>
        </nav>

        <div className="p-4">

          {dataNotLoaded && (
            <div className="mb-2 p-4 bg-red-200">
              <h2 className="font-bold text-xl mb-2">
                Data not loaded, would you like to load now?
              </h2>
              <button onClick={fetchTransportData}>Load Now!</button>
            </div>
          )}

          <Outlet />
        </div>
      </div>

      <div className="p-4 flex justify-center items-center bg-gray-200">
        <p>TEXT</p>
      </div>
    </div>
  );
};

export default Layout;
