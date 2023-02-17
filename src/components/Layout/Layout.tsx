import { Link, Outlet } from "react-router-dom";
import { CLEAR_DATA, DATA_COUNT, FETCH_TRANSPORT_DATA, LIST_FILES } from "../../constants/WorkerMessageTypes";
import { useWorker } from "../../context/WorkerContext";

const Layout = () => {
  const { worker, setUpWorker } = useWorker();

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
    <div className="flex flex-col">
      <div className="bg-blue-200 h-16"></div>

      <div className="flex">
        <nav>
          <ul>
            <li>
              {/* todo manually start loading worker: */}
              <button onClick={setUpWorker}>Load worker</button>
            </li>
            {worker && (
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
            )}

          </ul>
        </nav>

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
