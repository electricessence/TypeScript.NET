import { Primitive } from "../Primitive";
import { JsonMap, JsonArray } from "../../JSON";
export default function clone(source: Primitive | JsonMap | JsonArray, depth?: number): any;
