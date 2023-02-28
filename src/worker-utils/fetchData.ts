import { DB_LOADING_STATE } from "../constants/WorkerMessageTypes";
import { parseRouteData, parseRouteStopData, parseCoorData, BusRoute, Coor } from "./xmlParser";
import { BusRouteStopType} from '../model/BusRouteStopType';

const extractBusRoute = ({ routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time }: BusRoute) => {
  return [routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time];
}

export const insertBusRoutes = async (db: any, routes: BusRoute[]) => {
  for (let i = 0; i < routes.length; i = i + 10) {
    const dataArray = [...Array(10).keys()]
      .filter(j => (i + j) < routes.length);

    const data = dataArray
      .reduce((acc: any[], cur) => {
        return [
          ...acc,
          ...extractBusRoute(routes[i + cur])
        ];
      }, []);

    db.exec({
      sql: `
        insert into busfare3a (routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time) values 
        ${Array(dataArray.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}
        `,
      bind: data,
    });

    if (i % 100 === 0) {
      postMessage({
        type: DB_LOADING_STATE,
        data: `${i}/${routes.length} routes inserted`,
      });
    }
  }
};

const extractRouteStop = ({
  routeid, stopid, stopseq, routedir, stopc
}: BusRouteStopType) => {
  return [routeid, stopid, stopseq, routedir, stopc];
}

export const insertRouteStops = async (db: any, routeStops: BusRouteStopType[]) => {
  for (let i = 0; i < routeStops.length; i = i + 20) {
    const dataArray = [...Array(20).keys()]
      .filter(j => (i + j) < routeStops.length);

    const data: any[] = dataArray.reduce((acc: any[], cur) => {
      return [
        ...acc,
        ...extractRouteStop(routeStops[i + cur])
      ];
    }, []);

    if (data.length > 0) {
      db.exec({
        sql: `
          insert into rstop2 (routeid, stopid, stopseq, routedir, stopc) values 
          ${Array(dataArray.length).fill('(?, ?, ?, ?, ?)').join(', ')}
          `,
        bind: data,
      });
    }

    if (i % 500 === 0) {
      postMessage({
        type: DB_LOADING_STATE,
        data: `${i}/${routeStops.length} stops inserted`,
      });
    }
  }
}

const extractCoors = ({ stopid, lat, lng }: Coor) => {
  return [stopid, lat, lng];
}

export const insertCoors = async (db: any, coors: Coor[]) => {
  for (let i = 0; i < coors.length; i = i + 10) {
    const dataArray = [...Array(10).keys()]
      .filter(j => (i + j) < coors.length);

    const data = dataArray.reduce((acc: any[], cur) => {
      return [
        ...acc,
        ...extractCoors(coors[i + cur])
      ];
    }, []);

    db.exec({
      sql: `
        INSERT INTO coors (stopid, lat, lng) values 
        ${Array(dataArray.length).fill('(?, ?, ?)').join(', ')}
        `,
      bind: data
    });

    if (i % 100 === 0) {
      postMessage({
        type: DB_LOADING_STATE,
        data: `${i}/${coors.length} stop coordinates inserted`,
      });
    }
  }
}

export const fetchData = async (db: any) => {
  const [routes, routeStops, coors] = await Promise.all([parseRouteData(), parseRouteStopData(), parseCoorData()]);

  return Promise.all([
    insertBusRoutes(db, routes),
    insertRouteStops(db, routeStops),
    insertCoors(db, coors),
  ])
};
