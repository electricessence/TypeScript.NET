/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Primitive } from "../Primitive";
import { JsonArray, JsonMap } from "../../JSON";
export default function clone(source: Primitive | JsonMap | JsonArray, depth?: number): any;
