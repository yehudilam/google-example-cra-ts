import convert from 'xml-js';
import convert1980 from '../utils/hk1980Wgs';

const BUS_ROUTES_XML = 'https://static.data.gov.hk/td/routes-fares-xml/ROUTE_BUS.xml';

interface NameMapType{
  xmlName: string;
  tableColName: string;
}

export interface BusRoute {
  routeid: number; 
  company: string; 
  routec: string; 
  route_type: number; 
  service_mode: string; 
  company_st: string; 
  special_type: string; 
  startc: string; 
  destinc: string; 
  fullfare: number; 
  journey_time: number;
}

const nameMap: NameMapType[] = [
  {
    xmlName: 'ROUTE_ID',
    tableColName: 'routeid',
  },
  {
    xmlName: 'COMPANY_CODE',
    tableColName: 'company',
  },
  {
    xmlName: 'ROUTE_NAMEC',
    tableColName: 'routec',
  },
  {
    xmlName: 'ROUTE_TYPE',
    tableColName: 'route_type',
  },
  {
    xmlName: 'SERVICE_MODE',
    tableColName: 'service_mode',
  },
  {
    xmlName: 'SPECIAL_TYPE',
    tableColName: 'special_type',
  },
  {
    xmlName: 'LOC_START_NAMEC',
    tableColName: 'startc',
  },
  {
    xmlName: 'LOC_END_NAMEC',
    tableColName: 'destinc',
  },
  {
    xmlName: 'FULL_FARE',
    tableColName: 'fullfare',
  },
  {
    xmlName: 'JOURNEY_TIME',
    tableColName: 'journey_time',
  },
];

const fetchXmlString = async (url: string) => {
  const response = await fetch(url);
  const xmlString = await response.text();

  return convert.xml2js(xmlString);
}

// list of routes:
const parseRouteData = async () => {
  const res = await fetchXmlString(BUS_ROUTES_XML)

  const data = res.elements[0].elements.map((item: any) => {
    // name: "ROUTE",
    const { elements } = item;

    return nameMap.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.tableColName]: elements.find((el: any) => el.name === cur.xmlName)?.elements[0]?.text
      }
    }, {});
  });

  return data;
};

// const BUS_ROUTE_STOP_XML = 'https://static.data.gov.hk/td/routes-fares-xml/RSTOP_BUS.xml';
const BUS_ROUTE_STOP_JSON = 'https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json';

const BUS_STOP_COOR = 'https://static.data.gov.hk/td/routes-fares-xml/STOP_BUS.xml';

// list of route-stops
const parseRouteStopData = async () => {
  const response = await fetch(BUS_ROUTE_STOP_JSON);
  const json = await response.json();

  // console.log('route stop json', json);

  return json.features.map((feat: any) => {
    const {
      properties: {
        routeId, stopSeq, routeSeq: routedir,
        stopId, stopNameC: stopc,
      }
    } = feat;

    return {
      routeid: routeId,
      stopseq: stopSeq,
      routedir, stopc,
      stopid: stopId,
    };
  });
}

export interface CoorGrid {
  stopid: number;
  x: number;
  y: number;
}

export interface Coor{
  stopid: number;
  lat: number;
  lng: number;
}

// list of coors
const parseCoorData = async () => {
  const res = await fetchXmlString(BUS_STOP_COOR);
  console.log('coor res', res);

  return res.elements[0].elements.map((item: any) => {
    // stopid, x, y
    return item.elements.reduce((acc: CoorGrid, cur: any) => {
      if(cur.name === 'STOP_ID'){
        return {
          ...acc,
          stopid: parseInt(cur.elements[0].text, 10), 
        }
      }else if(cur.name === 'X'){
        return {
          ...acc,
          x: parseInt(cur.elements[0].text, 10),
        }
      }else if(cur.name === 'Y'){
        return {
          ...acc,
          y: parseInt(cur.elements[0].text, 10),
        }
      }

      return acc;
    }, {
      stopid: 0,
      x: 0, 
      y: 0,
    });
  })
  .map(({ stopid, x, y }: CoorGrid) => {
    const [lat, lng] = convert1980(y, x);

    return {
      lat, lng, stopid,
    };
  })
  
};

export {parseRouteData, parseRouteStopData, parseCoorData};