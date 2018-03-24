/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOf from "../../Reflection/TypeOf";
import hasMemberOfType from "../../Reflection/hasMemberOfType";

export default function isPromise<T>(value:any):value is PromiseLike<T>
{
	return hasMemberOfType(value, "then", TypeOf.Function);
}
