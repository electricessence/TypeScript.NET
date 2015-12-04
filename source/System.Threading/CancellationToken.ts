/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

const noneToken = new CancellationToken();
Object.freeze(noneToken);


class CancellationToken
{
	canBeCancelled:boolean;
	isCancellationRequested:boolean;
	throwIfCancellationRequested:boolean;

	static get none():CancellationToken
	{
		return noneToken;
	}

	//waitHandle: WaitHandle;

	/*
	 // many overloads...
	 register(action: System.Action<any>, useSynchronizationContext): CancellationTokenRegistration
	 {
	 }*/
}

export default CancellationToken;
