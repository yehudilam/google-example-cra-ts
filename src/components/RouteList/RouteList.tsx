// import useSetupWorker from "../../hooks/useSetupworker";
import { useWorker } from "../../context/WorkerContext";
import BusRoute from "../BusRouteList/BusRoute";

const BusRouteList = () => {
  // const { data: { routes } } = useSetupWorker();
  const { data: { routes }} = useWorker();

  if(routes?.length === 0){
    return <></>;
  }

  return (
    <div>
      {routes?.map((route: any) => <BusRoute key={route.routeid} route={route} />)}
    </div>
  )
};

export default BusRouteList;
