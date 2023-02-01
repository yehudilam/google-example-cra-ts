import { BusRouteStopByDirectionType } from "./BusRouteStopType";

export interface BusRouteDetailsType {
  routec: string;
  routeid: number;
  startc: string;
  destinc: String;
  stops: BusRouteStopByDirectionType[];
}