import { GET_ROUTES } from "../constants/WorkerMessageTypes";
import { useWorker } from "../context/WorkerContext";

const Home = () => {
  const { worker } = useWorker();

  const clickMe = () => {
    // console.log('click me', worker);
    worker.postMessage({
      type: GET_ROUTES,
    });
  };

  return (
    <div>
      route data here:

      <button onClick={() => {
        console.log('clicking me');
        clickMe();
      }}>Click me</button>
    </div>
  );
};

export default Home;
