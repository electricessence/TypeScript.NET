/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Type from "../../Types";
import TypeOfValue from "../../TypeOfValue";

export default function isPromise<T>(value:any):value is PromiseLike<T>
{
	return Type.hasMemberOfType(value, "then", TypeOfValue.Function);
}
