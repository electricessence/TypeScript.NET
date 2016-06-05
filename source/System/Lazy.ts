/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ILazy} from "./ILazy";
import {Func} from "./FunctionTypes";
import {ResolverBase} from "./ResolverBase";
import __extendsImport from "../extends";
const __extends = __extendsImport;


// We need a non-resettable lazy to ensure it can be passed safely around.
export class Lazy<T> extends ResolverBase<T> implements ILazy<T>
{

	constructor(valueFactory:Func<T>, trapExceptions:boolean = false, allowReset:boolean = false)
	{
		super(valueFactory, trapExceptions, allowReset);
		this._disposableObjectName = 'Lazy';
		this._isValueCreated = false;
	}

	get isValueCreated():boolean
	{
		return !!this._isValueCreated;
	}

	get value():T
	{
		return this.getValue();
	}

	equals(other:Lazy<T>):boolean
	{
		return this==other;
	}

	valueEquals(other:Lazy<T>):boolean
	{
		return this.equals(other) || this.value===other.value;
	}

}

export class ResettableLazy<T> extends Lazy<T>
{
	constructor(valueFactory:Func<T>, trapExceptions:boolean = false)
	{
		super(valueFactory, trapExceptions, true);
	}
}

export default Lazy;