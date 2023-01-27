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

// list of routes:
const parseRouteData = async () => {
  const response = await fetch(BUS_ROUTES_XML);
  const xmlString = await response.text();

  const res = convert.xml2js(xmlString);

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

  console.log('xml parser data', data);

  return data;
};

// list of route-stops

// list of coors

export default parseRouteData;