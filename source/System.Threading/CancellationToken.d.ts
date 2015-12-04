/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

// NOTE: This is to allow interfaces to utilize this without import.
// It's not an interface itself because CancellationToken uses instanceof to identify it.

declare class CancellationToken
{
	canBeCancelled:boolean;
	isCancellationRequested:boolean;
	throwIfCancellationRequested:boolean;
}