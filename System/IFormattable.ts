/*
* @author electricessence / https://github.com/electricessence/
* Based upon .NET source.
* Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System
{

	// http://referencesource.microsoft.com/#mscorlib/system/iformattable.cs
	export interface IFormattable
	{
		toString(format?: string, formatProvider?: IFormatProvider): string;
	}
}
