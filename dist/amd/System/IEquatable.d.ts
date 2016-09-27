/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IEquatable.cs
 */

export interface IEquatable<T>
{
	equals(other:T):boolean;
}

export default IEquatable;
