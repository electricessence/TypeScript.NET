///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	export class XText extends XNode
	{
		private _value: string;

		constructor(value:string)
		constructor(value:XText)
		constructor(value:any)
		{

			super();

			if (value instanceof XText)
				value = value.Value;

			if(value != null && typeof (value) == System.Types.String))
				throw "Invalid Type: must be XText or string.";

			this._value = value;

		}

		get value(): string
		{
			return this._value;
		}

		set value(text: string)
		{
			this._value = text;
		}


	}
}