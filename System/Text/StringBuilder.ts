///<reference path="../Types.ts"/>
///<reference path="../Collections/LinkedList.ts"/>
///<reference path="../IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
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

	var Types = new System.Types();

	export class StringBuilder implements IDisposable
	// Adding IDisposable allows for use with System.using();
	// ... and since this may end up being a large array container, might be a good idea to allow for flexible cleanup.
	{
		// Since there are potential 'insert' operations occuring, we will use a LinkedList and then decide our concat scheme after.
		private _parts: System.Collections.LinkedList<any>;
		private _partArray: any[];
		private _latest: string;

		constructor(...initial: any[])
		{
			var _ = this;
			_._parts = new LinkedList<any>();
			_._latest = null;
			_._partArray = null;
			_.appendThese(initial);
		}

		private appendSingle(item: any): void
		{
			if (item !== null && item !== undefined)
			{
				var _ = this;
				_._latest = null;
				_._partArray = null; // The array itself is just a lightweight container for existing values.
				switch (typeof item)
				{
					case Types.Object:
					case Types.Function:
						item = item.toString();
						break;
				}
				_._parts.add(item); // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
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
					_._parts.add("\r\n");
				}
			});
			return _;
		}

		get isEmpty()
		{
			return this._parts.count === 0;
		}

		private _getCachedArray(): any[]
		{
			var a = this._partArray;
			if (!a)
				this._partArray = a = this._parts.toArray();
			return a;
		}

		toString()
		{
			var latest = this._latest;
			if (!latest === null)
				this._latest = latest = this._getCachedArray().join();

			return latest;
		}

		join(delimiter: string): string
		{
			return this._getCachedArray().join(delimiter);
		}

		clear(): void
		{
			this._parts.clear();
			this._latest = null;
		}

		dispose(): void
		{
			this.clear();
		}

	}

}
