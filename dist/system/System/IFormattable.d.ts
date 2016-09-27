/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IFormattable.cs
 */


import {IFormatProvider} from "./IFormatProvider";
export interface IFormattable
{
	toString(format?:string, formatProvider?:IFormatProvider):string;
}

export default IFormattable;
