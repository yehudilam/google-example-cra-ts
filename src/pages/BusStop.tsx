import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BusRouteList from "../components/BusRouteList/BusRouteList";
import { GET_STOP_ROUTES } from "../constants/WorkerMessageTypes";
import { useWorker } from "../context/WorkerContext";

const BusStop = () => {
  const { stopid } = useParams();
  const { worker,
    data: { coor, stopcs },
  } = useWorker();

  useEffect(() => {
    worker.postMessage({
      type: GET_STOP_ROUTES,
      variables: {
        stopid,
      },
    })
  }, [stopid, worker]);

  console.log(coor, stopcs);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl mb-2">Bus stop:</h2>

        <div className="mb-4">
          <h4 className="mr-2 font-bold">Stop names used:</h4>

          <div className="flex">
            {stopcs?.map((stopc, index) => <p key={`${stopc}-${index}`} className="mr-2">{stopc}</p>)}
          </div>
        </div>

        <div className="mb-4 flex">
          <h4 className="mr-2">Coordinates:</h4>
          <p>{coor?.lat} {coor?.lng}</p>
        </div>
      </div>

      <BusRouteList />
    </div>
  );
};

export default BusStop;
