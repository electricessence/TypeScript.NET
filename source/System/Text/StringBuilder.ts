/*!
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/text/StringBuilder.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../Types";
import {IDisposable} from "../Disposable/IDisposable";

const VOID0:any = void 0;

/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/string-concatenation-looped
 * http://jsperf.com/adding-strings-to-an-array
 * http://jsperf.com/string-concatenation-versus-array-operations-with-join
 *
 * It is clearly inefficient to use a StringBuilder or LinkedList to build a string when you have a small set of string portions.
 * StringBuilder will really show it's benefit likely somewhere above 1000 items.
 *****************************/


export class StringBuilder implements IDisposable
	// Adding IDisposable allows for use with System.using();
	// ... and since this may end up being a large array container, might be a good idea to allow for flexible cleanup.
{
	//noinspection JSMismatchedCollectionQueryUpdate
	private _partArray:any[];
	private _latest:string; // AKA persistentString

	constructor(...initial:any[])
	{
		var _ = this;
		_._latest = null;
		_._partArray = [];
		_.appendThese(initial);
	}

	private appendSingle(item:any):void
	{
		if(item!==null && item!==VOID0)
		{
			var _ = this;
			_._latest = null;
			switch(typeof item)
			{
				case Type.OBJECT:
				case Type.FUNCTION:
					item = item.toString();
					break;
			}
			_._partArray.push(item); // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
		}

	}

	appendThese(items:any[]):StringBuilder
	{
		var _ = this;
		items.forEach(s=> _.appendSingle(s));
		return _;
	}

	append(...items:any[]):StringBuilder
	{
		this.appendThese(items);
		return this;
	}

	appendLine(...items:any[]):StringBuilder
	{
		this.appendLines(items);
		return this;
	}

	appendLines(items:any[]):StringBuilder
	{
		var _ = this;
		items.forEach(
			i=>
			{
				if(i!==null && i!==VOID0)
				{
					_.appendSingle(i);
					_._partArray.push("\r\n");
				}
			}
		);
		return _;
	}

	/** /// These methods can only efficiently be added if not using a single array.
	 insert(index: number, value: string, count: number = 1): StringBuilder
	 {

	}

	 remove(startIndex:number, length:number): StringBuilder
	 {

	}
	 /**/

	get isEmpty()
	{
		return this._partArray.length===0;
	}

	toString()
	{
		var latest = this._latest;
		if(!latest===null)
			this._latest = latest = this._partArray.join();

		return latest;
	}

	join(delimiter:string):string
	{
		return this._partArray.join(delimiter);
	}

	clear():void
	{
		this._partArray.length = 0;
		this._latest = null;
	}

	dispose():void
	{
		this.clear();
	}

}

export default StringBuilder;