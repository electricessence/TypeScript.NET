///<reference path="../Types.ts"/>
///<reference path="../IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import IDisposable = System.IDisposable;

module System.Text
{
	/*****************************
	 * IMPORTANT NOTES ABOUT PERFORMANCE:
	 * http://jsperf.com/string-concatenation-looped
	 * http://jsperf.com/adding-strings-to-an-array
	 * 
	 * It is clearly inefficient to use a StringBuilder or LinkedList to build a string when you have a small set of string portions.
	 *****************************/

	var Types = new System.Types();

	export class StringBuilder implements IDisposable
	// Adding IDisposable allows for use with System.using();
	// ... and since this may end up being a large array container, might be a good idea to allow for flexible cleanup.
	{
		// Although we could simply have an array of any[] and store all values, that would potentially retain references to objects.
		private _parts: string[];

		constructor(...initial: any[])
		{
			var _ = this;
			_._parts = [];
			_.appendThese(initial);
		}

		private appendSingle(item: any): void
		{
			if (item !== null && item !== undefined)
			{
				switch (typeof item)
				{
					case Types.Object:
					case Types.Function:
						item = item.toString();
						break;
				}
				this._parts.push(item); // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
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
					_._parts.push("\r\n");
				}
			});
			return _;
		}

		get isEmpty()
		{
			return this._parts.length === 0;
		}

		toString(delimiter: string = "")
		{
			return this._parts.join(delimiter);
		}

		clear(): void
		{
			this._parts.length = 0;
		}

		dispose(): void
		{
			this.clear();
		}

	}

}
