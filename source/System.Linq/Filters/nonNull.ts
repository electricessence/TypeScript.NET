/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Predicate} from "../../System/FunctionTypes";

function nonNull<T>(e:T) :boolean
{
	return e!=null;
}

export default function<T>() :Predicate<T>
{
	return nonNull;
}