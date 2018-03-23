/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import TypeOfValue from "../../Reflection/TypeOfValue";
import hasMemberOfType from "../../Reflection/hasMemberOfType";

export default function isPromise<T>(value:any):value is PromiseLike<T>
{
	return hasMemberOfType(value, "then", TypeOfValue.Function);
}
