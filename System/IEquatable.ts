/*
* @author electricessence / https://github.com/electricessence/
* Based upon .NET source.
* Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System {

	// http://referencesource.microsoft.com/#mscorlib/system/iequatable.cs
	export interface IEquatable<T> {
		equals(other:T): boolean;
	}
	
} 