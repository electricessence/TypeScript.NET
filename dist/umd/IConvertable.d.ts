/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IConvertible.cs
 */
import IFormatProvider from "./IFormatProvider";
export default interface IConvertible {
    toBoolean(provider: IFormatProvider): boolean;
    toNumber(provider: IFormatProvider): number;
    toString(provider: IFormatProvider): string;
}
