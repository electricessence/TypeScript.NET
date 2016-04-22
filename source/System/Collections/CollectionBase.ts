/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ICollection.d.ts"/>
///<reference path="Enumeration/IEnumerateEach.d.ts"/>
import {forEach} from "./Enumeration/Enumerator";
import {areEqual} from "../Compare";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import DisposableBase from "../Disposable/DisposableBase";

//noinspection SpellCheckingInspection
const NAME = "CollectionBase",
      CMDC = "Cannot modify a disposed collection.",
      CMRO = "Cannot modify a read-only collection.";

abstract class CollectionBase<T>
extends DisposableBase implements ICollection<T>, IEnumerateEach<T>
{


	constructor(
		source?:IEnumerableOrArray<T>,
		protected _equalityComparer:EqualityComparison<T> = areEqual)
	{
		super();
		this._disposableObjectName = NAME;
		this._importEntries(source);
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

	protected _onModified():void {}

	protected abstract _addInternal(entry:T):boolean;

	add(entry:T):void
	{
		this.assertModifiable();
		if(this._addInternal(entry))
			this._onModified();
	}

	protected abstract _removeInternal(entry:T, max?:number):number;

	remove(entry:T, max:number = Infinity):number
	{
		this.assertModifiable();
		var n = this._removeInternal(entry, max);
		if(n) this._onModified();
		return n;
	}

	protected abstract _clearInternal():number;

	clear():number
	{
		this.assertModifiable();
		var n = this._clearInternal();
		if(n) this._onModified();
		return n;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._clearInternal();
	}

	protected _importEntries(entries:IEnumerableOrArray<T>):boolean
	{
		var added = false;
		if(entries)
		{
			forEach(entries, e=>
			{
				if(this._addInternal(e)) added = true;
			});
		}
		return added;
	}

	importEntries(entries:IEnumerableOrArray<T>):boolean
	{
		this.assertModifiable();
		var added = this._importEntries(entries);
		if(added) this._onModified();
		return added;
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

	forEach(action:Predicate<T>|Action<T>, useCopy?:boolean):void
	{
		if(useCopy) {
			var a = this.toArray();
			forEach(a, action);
			a.length = 0;
		} else {
			forEach(this.getEnumerator(), action);
		}
	}

	copyTo<TTarget extends IArray<T>>(
		target:TTarget,
		index:number = 0):TTarget
	{
		if(!target) throw new ArgumentNullException('target');

		var count = this.getCount(), newLength = count + index;
		if(target.length<newLength) target.length = newLength;

		forEach(this.getEnumerator(),(e, i)=>
		{
			target[i] = e;
		});

		return target;
	}

	toArray():T[]
	{
		var count = this.getCount();
		return this.copyTo(count>65536 ? new Array<T>(count) : []);
	}


}

export default CollectionBase;