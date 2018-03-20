/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import {Primitive} from "./System/Primitive";
import {IMap} from "./IMap";

export type JsonEntry = Primitive | JsonArray | JsonMap;

export interface JsonArray extends ArrayLike<JsonEntry>
{

}

export interface JsonMap extends IMap<JsonEntry>
{

}

export type JsonData = JsonMap | JsonArray;
