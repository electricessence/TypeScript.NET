/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "./TypeOfValue";
import hasMemberOfType from "./hasMemberOfType";

export default function hasMethod<T>(instance:any, property:string):instance is T
{
	return hasMemberOfType<T>(instance, property, TypeOfValue.Function);
}