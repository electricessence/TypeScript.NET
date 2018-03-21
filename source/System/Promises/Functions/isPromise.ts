/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Type from "../../Types";

export default function isPromise<T>(value:any):value is PromiseLike<T>
{
	return Type.hasMemberOfType(value, "then", Type.FUNCTION);
}
