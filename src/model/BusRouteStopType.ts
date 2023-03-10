
export interface BusRouteStopType {
  routeid: number;
  routedir: number;
  stopid: number;
  stopseq: number;
  stopc: string;
}

export interface BusRouteStopByDirectionType {
  stops: BusRouteStopType[];
}