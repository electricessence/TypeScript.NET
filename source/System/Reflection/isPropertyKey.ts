/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "./TypeOfValue";
import IMap from "../../IMap";

export module PropertyKey
{
	export const typeOfValues:ReadonlyArray<TypeOfValue> = Object.freeze([
		TypeOfValue.String,
		TypeOfValue.Number,
		TypeOfValue.Symbol,
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
