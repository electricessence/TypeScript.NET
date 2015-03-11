///<reference path="../Types.ts"/>
///<reference path="../Collections/LinkedList.ts"/>
///<reference path="../IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/text/stringbuilder.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import IDisposable = System.IDisposable;
import LinkedList = System.Collections.LinkedList;

module System.Text
{
	/*****************************
	 * IMPORTANT NOTES ABOUT PERFORMANCE:
	 * http://jsperf.com/string-concatenation-looped
	 * http://jsperf.com/adding-strings-to-an-array
	 * http://jsperf.com/string-concatenation-versus-array-operations-with-join
	 * 
	 * It is clearly inefficient to use a StringBuilder or LinkedList to build a string when you have a small set of string portions.
	 * StringBuilder will really show it's benefit likely somewhere above 1000 items.
	 *****************************/

	import Types = System.Types;

	export class StringBuilder implements IDisposable
	// Adding IDisposable allows for use with System.using();
	// ... and since this may end up being a large array container, might be a good idea to allow for flexible cleanup.
	{
		//noinspection JSMismatchedCollectionQueryUpdate
		private _partArray: any[];
		private _latest: string; // AKA persistentString

		constructor(...initial: any[])
		{
			var _ = this;
			_._latest = null;
			_._partArray = [];
			_.appendThese(initial);
		}

		private appendSingle(item: any): void
		{
			if (item !== null && item !== undefined)
			{
				var _ = this;
				_._latest = null;
				switch (typeof item)
				{
					case Types.Object:
					case Types.Function:
						item = item.toString();
						break;
				}
				_._partArray.push(item); // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
			}

		}

		appendThese(items: any[]): StringBuilder
		{
			var _ = this;
			items.forEach(s=> _.appendSingle(s));
			return _;
		}

		append(...items: any[]): StringBuilder
		{
			this.appendThese(items);
			return this;
		}

		appendLine(...items: any[]): StringBuilder
		{
			this.appendLines(items);
			return this;
		}

		appendLines(items: any[]): StringBuilder
		{
			var _ = this;
			items.forEach(i=>
			{
				if (i !== null && i !== undefined)
				{
					_.appendSingle(i);
					_._partArray.push("\r\n");
				}
			});
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
			return this._partArray.length === 0;
		}

		toString()
		{
			var latest = this._latest;
			if (!latest === null)
				this._latest = latest = this._partArray.join();

			return latest;
		}

		join(delimiter: string): string
		{
			return this._partArray.join(delimiter);
		}

		clear(): void
		{
			this._partArray.length = 0;
			this._latest = null;
		}

		dispose(): void
		{
			this.clear();
		}

	}

}
