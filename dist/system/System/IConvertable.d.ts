/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IConvertible.cs
 */

import {IFormatProvider} from "./IFormatProvider";


export interface IConvertible
{

//	getTypeCode(): TypeCode;

	toBoolean(provider:IFormatProvider):boolean;
//	toChar(provider: IFormatProvider): char;
//	toSByte(provider: IFormatProvider): sbyte;
//	toByte(provider: IFormatProvider): byte;
//	toInt16(provider: IFormatProvider): short;
//	toUInt16(provider: IFormatProvider): ushort;
//	toInt32(provider: IFormatProvider): int;
//	toUInt32(provider: IFormatProvider): uint;
//	toInt64(provider: IFormatProvider): long;
//	toUInt64(provider: IFormatProvider): ulong;
//	toSingle(provider: IFormatProvider): float;
//	toDouble(provider: IFormatProvider): double;
//	toDecimal(provider: IFormatProvider): Decimal;
//	toDateTime(provider: IFormatProvider): DateTime;

	toNumber(provider:IFormatProvider):number;
	toString(provider:IFormatProvider):string;

//	toType(conversionType: Type, provider: IFormatProvider): Object;
}

