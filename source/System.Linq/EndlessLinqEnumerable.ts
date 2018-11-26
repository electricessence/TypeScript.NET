/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {ILinqEndless} from "./ILinq/ILinqEndless";
import {LinqEnumerableBase} from "./LinqEnumerableBase";
import IEnumerator, {EndlessIEnumerator} from "../System/Collections/Enumeration/IEnumerator";
import {Closure} from "../System/FunctionTypes";

export {ILinqEndless}

export default class EndlessLinqEnumerable<T>
	extends LinqEnumerableBase<T>
	implements ILinqEndless<T>
{
	constructor(
		enumeratorFactory:() => IEnumerator<T>,
		finalizer?:Closure | null)
	{
		super(enumeratorFactory, finalizer);
		//@ts-ignore;
		this._disposableObjectName = "EndlessLinqEnumerable";
	}

	get isEndless():true { return true; }

	asEnumerable():this
	{
		const _ = this;
		_.throwIfDisposed();
		return <any> new EndlessLinqEnumerable<T>(() => _.getEnumerator());
	}

	getEnumerator():EndlessIEnumerator<T>
	{
		return <any>super.getEnumerator();
	}
}
