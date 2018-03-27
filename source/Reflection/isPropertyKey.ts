/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOf from "./TypeOf";
import IMap from "../IMap";

export module PropertyKey
{
	export const typeOfValues:ReadonlyArray<TypeOf> = Object.freeze([
		TypeOf.STRING,
		TypeOf.NUMBER,
		TypeOf.SYMBOL,
	]);
}

const keyTypeOfValues:IMap<boolean> = {};
PropertyKey.typeOfValues.forEach(v => keyTypeOfValues[v] = true);

/**
 * Returns true if the value is a string, number, or symbol.
 * (Can be used for indexing.)
 * @param value
 * @returns {boolean}
 */
export default function isPropertyKey(value:any):value is string | number | symbol
{
	return keyTypeOfValues[typeof value] || false;
}
