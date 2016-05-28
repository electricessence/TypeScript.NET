/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {forEach} from "./Enumeration/Enumerator";
import {areEqual} from "../Compare";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {DisposableBase} from "../Disposable/DisposableBase";
import {ICollection} from "./ICollection";
import {IEnumerator} from "./Enumeration/IEnumerator";
import {IEnumerateEach} from "./Enumeration/IEnumerateEach";
import {EqualityComparison, Predicate, Action} from "../FunctionTypes";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import {IArray} from "./Array/IArray";
import {Type} from "../Types";
import {ILinqEnumerable} from "../../System.Linq/Enumerable";

//noinspection SpellCheckingInspection
const NAME      = "CollectionBase",
      CMDC      = "Cannot modify a disposed collection.",
      CMRO      = "Cannot modify a read-only collection.",
      RESOLVE   = "resolve",
      LINQ_PATH = "../../System.Linq/Linq";

export abstract class CollectionBase<T>
extends DisposableBase implements ICollection<T>, IEnumerateEach<T>
{

	constructor(
		source?:IEnumerableOrArray<T>,
		protected _equalityComparer:EqualityComparison<T> = areEqual)
	{
		super();
		var _ = this;
		_._disposableObjectName = NAME;
		_._importEntries(source);
		_._updateRecursion = 0;
		_._modifiedCount = 0;
		_._version = 0;
	}


	protected abstract getCount():number;

	get count():number
	{
		return this.getCount();
	}

	protected getIsReadOnly():boolean
	{
		return false;
	}

	get isReadOnly():boolean
	{
		return this.getIsReadOnly();
	}

	protected assertModifiable():void
	{
		this.throwIfDisposed(CMDC);
		if(this.getIsReadOnly())
			throw new InvalidOperationException(CMRO);
	}

	protected _version:number; // Provides an easy means of tracking changes and invalidating enumerables.
	assertVersion(version:number):void
	{
		if(version!=this._version)
			throw new InvalidOperationException("Collection was modified.");
	}

	/*
	 * Note: Avoid changing modified count by any means but ++;
	 * If setting modified count by the result of a closure it may be a negative number or NaN and ruin the pattern.
	 */
	private _modifiedCount:number;
	private _updateRecursion:number;

	protected _onModified():void {}

	protected _signalModification(increment?:boolean):boolean
	{
		var _ = this;
		if(increment) _._modifiedCount++;
		if(_._modifiedCount && !this._updateRecursion)
		{
			_._modifiedCount = 0;
			_._version++;
			try
			{
				_._onModified();
			}
			catch(ex)
			{
				// Avoid fatal errors which may have been caused by consumer.
				console.error(ex);
			}
			return true;
		}
		return false;
	}

	protected _incrementModified():void { this._modifiedCount++; }

	get isUpdating():boolean { return this._updateRecursion!=0; }

	/**
	 * Takes a closure that if returning true will propagate an update signal.
	 * Multiple update operations can be occurring at once or recursively and the onModified signal will only occur once they're done.
	 * @param closure
	 * @returns {boolean}
	 */
	handleUpdate(closure?:() => boolean):boolean
	{
		if(!closure) return false;
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;
		var updated:boolean = false;

		try
		{
			if(updated = closure())
				_._modifiedCount++;
		}
		finally
		{
			_._updateRecursion--;
		}

		_._signalModification();

		return updated;
	}

	protected abstract _addInternal(entry:T):boolean;

	/*
	 * Note: for a slight amount more code, we avoid creating functions/closures.
	 * Calling handleUpdate is the correct pattern, but if possible avoid creating another function scope.
	 */

	add(entry:T):void
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		try
		{ if(_._addInternal(entry)) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();
	}

	protected abstract _removeInternal(entry:T, max?:number):number;

	remove(entry:T, max:number = Infinity):number
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		var n:number;
		try
		{ if(n = _._removeInternal(entry, max)) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();
		return n;
	}

	protected abstract _clearInternal():number;

	clear():number
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		var n:number;
		try
		{ if(n = _._clearInternal()) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();

		return n;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._clearInternal();
		this._version = 0;
		this._updateRecursion = 0;
		this._modifiedCount = 0;
		var l = this._linq;
		this._linq = null;
		if(l) l.dispose();
	}

	protected _importEntries(entries:IEnumerableOrArray<T>):number
	{
		var added = 0;
		if(entries)
		{
			if(Array.isArray(entries))
			{
				// Optimize for avoiding a new closure.
				for(let e of entries)
				{
					if(this._addInternal(e)) added++;
				}
			}
			else
			{
				forEach(entries, e=>
				{
					if(this._addInternal(e)) added++;
				});
			}
		}
		return added;
	}

	importEntries(entries:IEnumerableOrArray<T>):number
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		var n:number;
		try
		{ if(n = _._importEntries(entries)) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();
		return n;
	}

	// Fundamentally the most important part of the collection.
	abstract getEnumerator():IEnumerator<T>;

	contains(entry:T):boolean
	{
		if(!this.getCount()) return false;
		var found:boolean = false, equals = this._equalityComparer;
		this.forEach(e => !(found = equals(entry, e)));
		return found;
	}

	forEach(action:Predicate<T>|Action<T>, useCopy?:boolean):number
	{
		if(useCopy)
		{
			var a = this.toArray();
			try
			{
				return forEach(a, action);
			}
			finally
			{
				a.length = 0;
			}
		}
		else
		{
			return forEach(this.getEnumerator(), action);
		}
	}

	copyTo<TTarget extends IArray<T>>(
		target:TTarget,
		index:number = 0):TTarget
	{
		if(!target) throw new ArgumentNullException('target');

		var count = this.getCount(), newLength = count + index;
		if(target.length<newLength) target.length = newLength;

		var e = this.getEnumerator();
		while(e.moveNext()) // Disposes when finished.
		{
			target[index++] = e.current;
		}
		return target;
	}

	toArray():T[]
	{
		var count = this.getCount();
		return this.copyTo(count>65536 ? new Array<T>(count) : []);
	}

	private _linq:ILinqEnumerable<T>;
	get linq():ILinqEnumerable<T>
	{
		if(Type.hasMember(require, RESOLVE) && require.length==1)
		{
			var e = this._linq;
			if(!e) this._linq = e = require(LINQ_PATH).default.from(this);
			return e;
		}
		else
		{
			throw ".linq currently only supported within CommonJS.\nImport System.Linq/Linq and use Enumerable.from(e) instead.";
		}
	}

}

declare var require:any;
