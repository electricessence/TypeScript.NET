/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


///<reference path="../System/Collections/Arrays/IArray"/>
import System = require('../System/System');
import Functions = require('../System/Functions');
import ArrayUtility = require('../System/Collections/Arrays/Utility');
import ArrayEnumerator = require('../System/Collections/Enumeration/ArrayEnumerator');
import Enumerable= require('./Enumerable');
'use strict';

const
	INT_0:number = 0 | 0,
	INT_NEGATIVE_1 = -1 | 0,
	INT_POSITIVE_1 = +1 | 0;

class ArrayEnumerable<T> extends Enumerable<T>
{

	private _source:{ length: number;[x: number]: T; };

	constructor(source:IArray<T>)
	{
		var _ = this;
		_._source = source;
		super(
			() =>
			{
				_.assertIsNotDisposed();
				return new ArrayEnumerator<T>(
					() =>
					{
						_.assertIsNotDisposed("The underlying ArrayEnumerable was disposed.");

						return _._source; // Could possibly be null, but ArrayEnumerable if not disposed simply treats null as empty array.
					}
				);
			}
		);
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._source = <any>null;
	}

	get source():IArray<T> { return this._source; }

	toArray():T[]
	{
		var s = this.source;
		if(!s)
			return [];

		if(s instanceof Array)
			return (<any>s).slice();

		var len = s.length, result:T[] = new Array<T>(len);
		for(var i = INT_0; i<len; ++i) {
			result[i] = s[i];
		}

		return result;
	}

	asEnumerable():ArrayEnumerable<T>
	{
		return new ArrayEnumerable<T>(this._source);
	}

	// Optimize forEach so that subsequent usage is optimized.
	forEach(action:(element:T, index?:number) => boolean):void;
	forEach(action:(element:T, index?:number) => void):void;
	forEach(action:(element:T, index?:number) => any):void
	{

		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source;
		if(source) {

			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			for(var i = INT_0; i<source.length; ++i) {
				// _.assertIsNotDisposed(); // Assertion here is unnecessary since we already have a reference to the source array.
				if(action(source[i], i)===false)
					break;
			}
		}
	}

	// These methods should ALWAYS check for array length before attempting anything.

	any(predicate?:Predicate<T>):boolean
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source, len = source ? source.length : 0;
		return len && (!predicate || super.any(predicate));
	}

	count(predicate?:Predicate<T>):number
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source, len = source ? source.length : 0;
		return len && (predicate ? super.count(predicate) : len);
	}

	elementAt(index:number):T
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source;
		return (index<source.length && index>=0)
			? source[index]
			: super.elementAt(index);
	}

	elementAtOrDefault(index:number, defaultValue:T = null):T
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source;
		return (index<source.length && index>=0)
			? source[index]
			: defaultValue;
	}

	first():T
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source;
		return (source && source.length)
			? source[0]
			: super.first();
	}

	firstOrDefault(defaultValue:T = null):T
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source;
		return (source && source.length)
			? source[0]
			: defaultValue;
	}

	last():T
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source, len = source.length;
		return (len)
			? source[len - 1]
			: super.last();
	}

	lastOrDefault(defaultValue:T = null):T
	{
		var _ = this;
		_.assertIsNotDisposed();

		var source = _._source, len = source.length;
		return len
			? source[len - 1]
			: defaultValue;
	}

	skip(count:number):Enumerable<T>
	{

		var _ = this;

		if(!count || count<0) // Out of bounds? Simply return a unfiltered enumerable.
			return _.asEnumerable();

		return new Enumerable<T>(
			() => new ArrayEnumerator<T>(
				() => _._source, count
			)
		);
	}

	takeExceptLast(count:number = 1):Enumerable<T>
	{
		var _ = this, len = _._source ? _._source.length : 0;
		return _.take(len - count);
	}

	takeFromLast(count:number):Enumerable<T>
	{
		if(!count || count<0) return Enumerable.empty<T>();
		var _ = this, len = _._source ? _._source.length : 0;
		return _.skip(len - count);
	}

	reverse():Enumerable<T>
	{
		var _ = this;

		return new Enumerable<T>(
			() => new ArrayEnumerator<T>(
				() => _._source, _._source ? (_._source.length - 1) : 0, -1
			)
		);
	}

	memoize():ArrayEnumerable<T>
	{
		return new ArrayEnumerable<T>(this._source);
	}

	sequenceEqual(second:IEnumerable<T>, equalityComparer?:(a:T, b:T) => boolean):boolean;
	sequenceEqual(second:IArray<T>, equalityComparer?:(a:T, b:T) => boolean):boolean;
	sequenceEqual(second:any, equalityComparer:(a:T, b:T) => boolean = System.areEqual):boolean
	{
		if(second instanceof Array)
			return ArrayUtility.areEqual(this.source, <IArray<T>>second, true, equalityComparer);

		if(second instanceof ArrayEnumerable)
			return (<ArrayEnumerable<T>>second).sequenceEqual(this.source, equalityComparer);

		return super.sequenceEqual(second, equalityComparer);
	}


	toJoinedString(separator:string = "", selector:Selector<T, string> = Functions.Identity)
	{
		var s = this._source;
		return !selector && s instanceof Array
			? (<Array<T>>s).join(separator)
			: super.toJoinedString(separator, selector);
	}

}

export = ArrayEnumerable;
