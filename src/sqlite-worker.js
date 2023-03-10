import {
  // GET_ROUTE_STOPS_COUNT, GET_ROUTES_COUNT, 
  LIST_FILES, FETCH_TRANSPORT_DATA,
  GET_ROUTES, GET_ROUTES_RESULT, GET_ROUTE_STOPS, GET_ROUTE_STOP_RESULT, SEARCH_ROUTE_BY_NAME_RESULT, SEARCH_ROUTE_BY_NAME, GET_STOP_ROUTES, GET_STOP_ROUTES_RESULT, GET_ROUTE, GET_ROUTE_RESULT,
  DATA_COUNT, CLEAR_DATA, DB_READY,
  // GET_COORS_COUNT, DB_LOADING,
  DATA_COUNT_RESULT
} from './constants/WorkerMessageTypes';
import { fetchData } from "./worker-utils/fetchData";

console.log('Running demo from Worker thread.');

const checkDbFileExistance = async () => {
  console.log('checkDbFileExistance');

  try {
    const root = await navigator.storage.getDirectory();

    for await (const handle of root.values()) {
      console.log(
        'handle',
        handle,
        handle.kind === "directory" ? handle.name : [await handle.getFile(), (await handle.getFile())?.size]
      );
    }

  } catch (e) {
    console.error('check file error', e);
  }
}
// checkDbFileExistance();

const logHtml = function (cssClass, ...args) {
  postMessage({
    type: 'log',
    payload: { cssClass, args },
  });
};

const log = (...args) => logHtml('', ...args);
// const warn = (...args) => logHtml('warning', ...args);
const error = (...args) => logHtml('error', ...args);

let db;

const start = async function (sqlite3) {
  const capi = sqlite3.capi; /*C-style API*/
  const oo = sqlite3.oo1; /*high-level OO API*/
  log('sqlite3 version', capi.sqlite3_libversion(), capi.sqlite3_sourceid());

  if (sqlite3.opfs) {
    db = new sqlite3.opfs.OpfsDb('/mydb.sqlite3');
    log('The OPFS is available.');
  } else {
    db = new oo.DB('/mydb.sqlite3', 'ct');
    log('The OPFS is not available.');
  }
  log('transient db =', db.filename);

  try {
    log('Create a table...');

    db.exec(`CREATE TABLE IF NOT EXISTS busfare3a (
      routeid INTEGER PRIMARY KEY,
      company TEXT NOT NULL,
      routec TEXT NOT NULL,
      route_type INTEGER NOT NULL,
      service_mode TEXT NOT NULL,
      company_st TEXT DEFAULT NULL,
      special_type TEXT NOT NULL,
      startc TEXT NOT NULL,
      destinc TEXT NOT NULL,
      fullfare REAL NOT NULL,
      journey_time INTEGER NOT NULL
    );
    `);

    db.exec(`CREATE TABLE IF NOT EXISTS rstop2 (
      routeid INTEGER NOT NULL,
      stopid INTEGER NOT NULL,
      stopseq INTEGER NOT NULL,
      routedir INTEGER NOT NULL,
      stopc TEXT NOT NULL
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS coors (
      stopid INTEGER NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    )`)

    dataCount(db);

  } finally {
    // db.close();
  }
};

log('Loading and initializing sqlite3 module...');

let sqlite3Js = 'sqlite3.js';

/* eslint-disable-next-line no-restricted-globals */
const urlParams = new URL(self.location.href).searchParams;
if (urlParams.has('sqlite3.dir')) {
  sqlite3Js = urlParams.get('sqlite3.dir') + '/' + sqlite3Js;
}


/* eslint-disable-next-line no-undef */
importScripts(sqlite3Js);

// let sqlite3Instance;

/* eslint-disable-next-line no-restricted-globals */
self
  .sqlite3InitModule({
    print: log,
    printErr: error,
  })
  .then(function (sqlite3) {
    log('Done initializing. Running demo...');
    try {
      start(sqlite3);

      // sqlite3Instance = sqlite3;

      postMessage({
        type: DB_READY,
      })
    } catch (e) {
      error('Exception:', e.message);
    }
  });

onmessage = async (e) => {
  // console.log('on message', e);

  if (e?.data?.type === GET_ROUTES) {
    const results = [];

    db.exec({
      sql: 'select * from busfare3a limit 20;',
      rowMode: 'object',
      returnValue: "resultRows",

      callback: function (row) {
        results.push(row);
      }
      // .bind({ counter: 0 }),
    });

    postMessage({
      type: GET_ROUTES_RESULT,
      data: results,
    });
  } else if (e?.data?.type === GET_ROUTE_STOPS) {
    const results = [];
    const { routeid, routedir } = e?.data?.variables;

    db.exec({
      sql: 'SELECT * FROM rstop2 WHERE routeid=? AND routedir=?',
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [routeid, routedir],
      callback: function (row) {
        results.push(row)
      }
    });

    postMessage({
      type: GET_ROUTE_STOP_RESULT,
      data: results,
      mapKey: `${routeid}-${routedir}`
    });
  } else if (e?.data?.type === SEARCH_ROUTE_BY_NAME) {
    const results = [];
    const { routec } = e?.data?.variables;

    db.exec({
      sql: "SELECT * FROM busfare3a where routec LIKE ?",
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [`%${routec}%`],
      callback: function (row) {
        results.push(row);
      }
    });

    console.log('to post SEARCH_ROUTE_BY_NAME_RESULT', results);

    postMessage({
      type: SEARCH_ROUTE_BY_NAME_RESULT,
      data: results,
    });
  } else if (e?.data?.type === GET_STOP_ROUTES) {
    const results = [];
    const { stopid } = e?.data?.variables;

    let stopcs = [];
    let coor = {};

    // get stop name and coor
    db.exec({
      sql: "SELECT DISTINCT stopc from rstop2 where stopid=?",
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [stopid],
      callback: function ({ stopc }) {
        stopcs.push(stopc);
      }
    });

    db.exec({
      sql: "SELECT * from coors where stopid=?",
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [stopid],
      callback: function (row) {
        coor = row;
      }
    });

    db.exec({
      sql: "SELECT DISTINCT b.routeid, b.routec, b.startc, b.destinc FROM rstop2 as a join busfare3a as b on a.routeid=b.routeid where a.stopid=?",
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [stopid],
      callback: function (row) {
        results.push(row);
      }
    });

    postMessage({
      type: GET_STOP_ROUTES_RESULT,
      data: {
        routes: results,
        coor,
        stopcs,
      },
    });
  } else if (e?.data?.type === GET_ROUTE) {
    let routeDetail = undefined;
    const { routeid } = e?.data?.variables;

    db.exec({
      sql: "SELECT * FROM busfare3a where routeid=? limit 1",
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [routeid],
      callback: function (row) {
        routeDetail = row;
      }
    });

    if (!routeDetail) {
      // error
      return postMessage({
        type: GET_ROUTE_RESULT,
        error: 'ROUTE_NOT_FOUND',
      });
    }

    const routedir = [[], []];

    db.exec({
      sql: 'SELECT * FROM rstop2 WHERE routeid=? AND routedir=?',
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [routeid, 1],
      callback: function (row) {
        routedir[0].push(row)
      }
    });

    db.exec({
      sql: 'SELECT * FROM rstop2 WHERE routeid=? AND routedir=?',
      rowMode: 'object',
      returnValue: 'resultRows',
      bind: [routeid, 2],
      callback: function (row) {
        routedir[1].push(row)
      }
    });

    postMessage({
      type: GET_ROUTE_RESULT,
      data: {
        ...routeDetail,
        stops: routedir,
      }
    })
  } else if (e?.data?.type === LIST_FILES) {
    checkDbFileExistance();
  } else if (e?.data?.type === FETCH_TRANSPORT_DATA) {
    postMessage({
      type: 'DB_LOADING',
    });

    // await clearData(db);

    console.log('finish clear; ready to insert');

    // await fetchInsertBusRoutes(db);
    // await fetchInsertRouteStops(db);
    // await fetchInsertCoors(db);

    await fetchData(db);

    postMessage({
      type: 'DB_READY',
    });

    dataCount(db);

  } else if (e?.data?.type === DATA_COUNT) {
    dataCount(db);

  } else if (e?.data?.type === CLEAR_DATA) {
    await clearData(db);

    console.log('finish!');
  }
}

const clearData = async (db) => {
  console.log('clearing data: ');

  const promises = [
    new Promise(resolve => {
      db.exec({
        sql: 'DELETE FROM rstop2;',
        callback: () => resolve()
      });
    }),
    new Promise(resolve => {
      db.exec({
        sql: 'DELETE FROM busfare3a;',
        callback: () => resolve()
      });
    }),
    new Promise(resolve => {
      db.exec({
        sql: 'DELETE FROM coors;',
        callback: () => resolve()
      });
    }),
  ];

  console.log('clear data promises', promises)
  return Promise.all(promises);
};

// const dropTables = (db) => {
//   console.log('dropping tables');
//   db.exec('DROP TABLE IF EXISTS rstop2;');
//   db.exec('DROP TABLE IF EXISTS busfare3a;');
//   db.exec('DROP TABLE IF EXISTS coors;');
// }

const dataCount = (db) => {
  const count = {
    routes: 0,
    routeStops: 0,
    coors: 0,
  };

  db.exec({
    sql: 'SELECT COUNT(*) from busfare3a',
    rowMode: 'object',
    returnValue: 'resultRows',
    callback: function (row) {
      count.routes = row['COUNT(*)'];
    },
  });

  db.exec({
    sql: 'SELECT COUNT(*) from rstop2',
    rowMode: 'object',
    returnValue: 'resultRows',
    callback: function (row) {
      console.log(row, row['COUNT(*)']);
      count.routeStops = row['COUNT(*)'];
    },
  });

  db.exec({
    sql: 'SELECT COUNT(*) from coors',
    rowMode: 'object',
    returnValue: 'resultRows',
    callback: function (row) {
      count.coors = row['COUNT(*)'];
    },
  });

  postMessage({
    type: DATA_COUNT_RESULT,
    data: {
      count,
    },
  });
}

// todo: check if data are loaded, save last update date
// if 
// 1. data older than 3 months/ no data loaded, prompt load DB

// add point to point search capabilities (?)
