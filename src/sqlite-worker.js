import parseRouteData from "./utils/xmlParser";
import { GET_ROUTES, GET_ROUTES_RESULT } from './constants/WorkerMessageTypes';

console.log('Running demo from Worker thread.');

const logHtml = function (cssClass, ...args) {
  postMessage({
    type: 'log',
    payload: { cssClass, args },
  });
};

const log = (...args) => logHtml('', ...args);
const warn = (...args) => logHtml('warning', ...args);
const error = (...args) => logHtml('error', ...args);


const fetchInsertBusRoutes = async (db) => {
  const routes = await parseRouteData();

  for (let i = 0; i < routes.length; i++) {
    const { routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time } = routes[i];
    db.exec({
      sql: 'insert into busfare3a (routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      bind: [routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time],
    })
  }
};

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
    // db.exec('CREATE TABLE IF NOT EXISTS t(a,b)');
    db.exec('DROP TABLE IF EXISTS busfare3a;');

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

    await fetchInsertBusRoutes(db);

    db.exec({
      sql: 'select count(*) from busfare3a',
      callback: function (row) {
        log('row ', row)
      }.bind({ counter: 0 }),
    });

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

// console.log('urlParams', urlParams, 'sqlite3Js', sqlite3Js);

/* eslint-disable-next-line no-undef */
importScripts(sqlite3Js);

let sqlite3Instance;

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

      sqlite3Instance = sqlite3
    } catch (e) {
      error('Exception:', e.message);
    }
  });

onmessage = (e) => {
  console.log('on message', e);
  
  if (e?.data?.type === GET_ROUTES) {
    console.log('getting routes');

    // const capi = sqlite3Instance.capi; /*C-style API*/
    // const oo = sqlite3Instance.oo1; /*high-level OO API*/
    // log('sqlite3 version', capi.sqlite3_libversion(), capi.sqlite3_sourceid());
    // let db;

    // if (sqlite3Instance.opfs) {
    //   db = new sqlite3Instance.opfs.OpfsDb('/mydb.sqlite3');
    //   log('The OPFS is available.');
    // } else {
    //   db = new oo.DB('/mydb.sqlite3', 'ct');
    //   log('The OPFS is not available.');
    // }

    db.exec({
      sql: 'select * from busfare3a limit 20;',
      rowMode: 'object',
      callback: function (row) {
        console.log('call back post message', row);

        postMessage({
          type: GET_ROUTES_RESULT,
          data: row,
        })
      }.bind({ counter: 0 }),
      resultRows: function(row){
        console.log('result row', row);
      }
    });
  }
}
