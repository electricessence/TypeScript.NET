/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import SimpleEnumeratorBase from "./SimpleEnumeratorBase";
import {toArray} from "./Enumerator";
import {FiniteIEnumerable} from "./IEnumerable";

/**
 * Creates a randomized version of the source.
 * Note: An iterator will always require a arrayCopy (buffer) to pull random results one by one.
 */
export class Randomizer<T> extends SimpleEnumeratorBase<T>
{
	private readonly _buffer:T[];
	private _pointer:number;

	constructor(
		source:FiniteIEnumerable<T>,
		private readonly _allowReset:boolean = false)
	{
		super();
		this._buffer = toArray(source);
		this._pointer = this._buffer.length;
	}

	protected _canMoveNext():boolean
	{
		const p = this._pointer;
		return !isNaN(p) && p>0;
	}

	moveNext():boolean
	{
		const _ = this;
		if(_._canMoveNext())
		{
			const
				p = this._pointer, // Where were we?
				i = Math.floor(Math.random()*p), // Pick one.
				b = this._buffer,
				value = b[i],
				last = p - 1;


			b[i] = b[last]; // Take the last one and put it here.
			b[last] = <any>null; // clear possible reference.

			if(!this._allowReset && last%32==0) // Shrink?
				b.length = last;

			this._pointer = last;
			_._current = value;
			_.incrementIndex();
			return true;
		}

		return false;
	}

	reset():void
	{
		if(this._allowReset)
		{
			if(!this._buffer) throw "Randomizer cannot be reset.  Already disposed.";
			this._pointer = this._buffer.length;
			super.reset();
		}
		else
			throw "Reset not allowed.  To allow for reset, specify so when constructing.";
	}

	dispose():void
	{
		super.reset(); // Note... don't call this.reset() :|
		let b = this._buffer;
		(<any>this)._buffer = null;
		this._pointer = NaN;
		if(b) b.length = 0;
	}

	protected getIsEndless():boolean
	{
		return false;
	}


}