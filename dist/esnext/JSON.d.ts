import Primitive from "./System/Primitive";
import IMap from "./IMap";
export declare type JsonEntry = null | Primitive | JsonArray | JsonMap;
export interface JsonArray extends ArrayLike<JsonEntry> {
}
export interface JsonMap extends IMap<JsonEntry> {
}
export declare type JsonData = JsonMap | JsonArray;
