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
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
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

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
};

export default Layout;
