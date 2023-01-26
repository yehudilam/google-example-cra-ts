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

const BUS_ROUTES_XML = 'https://static.data.gov.hk/td/routes-fares-xml/ROUTE_BUS.xml';

const fetchBusRoutes = async () => {
  const response = await fetch(BUS_ROUTES_XML);
  const xml = await response.text();

  log(xml.substr(0, 1000));
};


const start = function (sqlite3) {
  fetchBusRoutes();

  const capi = sqlite3.capi; /*C-style API*/
  const oo = sqlite3.oo1; /*high-level OO API*/
  log('sqlite3 version', capi.sqlite3_libversion(), capi.sqlite3_sourceid());
  let db;
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
    // PRIMARY KEY (routeid),
    // starte TEXT COLLATE  NOT NULL,
    // destine TEXT COLLATE  NOT NULL,
    // KEY busfare3a_routec_index (routec)

    log('Insert some data using exec()...');

    /*
    let i;
    for (i = 20; i <= 25; ++i) {
      db.exec({
        sql: 'insert into t(a,b) values (?,?)',
        bind: [i, i * 2],
      });
    }
    log("Query data with exec() using rowMode 'array'...");
    db.exec({
      sql: 'select a from t order by a limit 3',
      rowMode: 'array', // 'array' (default), 'object', or 'stmt'
      callback: function (row) {
        log('row ', ++this.counter, '=', row);
      }.bind({ counter: 0 }),
    });
    */

    const routes = [
      {
        routeid: 1001,
        company: 'KMB',
        routec: '1',
        route_type: 1,
        service_mode: 'R',
        // company_st: null,
        special_type: '0',
        startc: '竹園邨',
        destinc: '尖沙咀碼頭',
        fullfare: 6.2,
        journey_time: 65,
      },
      {
        routeid: 1002,
        company: 'KMB',
        routec: '10',
        route_type: 1,
        service_mode: 'R',
        // company_st: null,
        special_type: '0',
        startc: '彩雲',
        destinc: '大角咀(循環線)',
        fullfare: 5.2,
        journey_time: 64,
      },
    ];

    for(let i = 0; i < routes.length; i++){
      const { routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time } = routes[i];
      db.exec({
        sql: 'insert into busfare3a (routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        bind: [routeid, company, routec, route_type, service_mode, company_st, special_type, startc, destinc, fullfare, journey_time],
      })
    }

    db.exec({
      sql: 'select routeid, routec, startc, destinc from busfare3a',
      rowMode: 'array', // 'array' (default), 'object', or 'stmt'
      callback: function (row) {
        log('row ', ++this.counter, '=', row);
      }.bind({ counter: 0 }),
    });
  } finally {
    db.close();
  }
};

log('Loading and initializing sqlite3 module...');

let sqlite3Js = 'sqlite3.js';

/* eslint-disable-next-line no-restricted-globals */
const urlParams = new URL(self.location.href).searchParams;
if (urlParams.has('sqlite3.dir')) {
  sqlite3Js = urlParams.get('sqlite3.dir') + '/' + sqlite3Js;
}

console.log('urlParams', urlParams, 'sqlite3Js', sqlite3Js);

/* eslint-disable-next-line no-undef */
importScripts(sqlite3Js);

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
    } catch (e) {
      error('Exception:', e.message);
    }
  });
