import convert from 'xml-js';

const BUS_ROUTES_XML = 'https://static.data.gov.hk/td/routes-fares-xml/ROUTE_BUS.xml';

interface NameMapType{
  xmlName: string;
  tableColName: string;
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

  // console.log('xml parser data', data);

  return data;
};

const BUS_ROUTE_STOP_XML = 'https://static.data.gov.hk/td/routes-fares-xml/RSTOP_BUS.xml';
const BUS_ROUTE_STOP_JSON = 'https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json';

// list of route-stops
const parseRouteStopData = async () => {
  // const res = await fetchXmlString(BUS_ROUTE_STOP_XML)
  // console.log('route stop res', res);

  // const data = res.elements[0].elements.map((item: any) => {

  // });

  const response = await fetch(BUS_ROUTE_STOP_JSON);
  const json = await response.json();

  console.log('route stop json', json);

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

// list of coors

export {parseRouteData, parseRouteStopData};