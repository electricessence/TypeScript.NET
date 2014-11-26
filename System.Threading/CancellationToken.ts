///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Threading
{
	var noneToken = new CancellationToken();

	export class CancellationToken
	{
		canBeCancelled: boolean;
		isCancellationRequested: boolean;
		throwIfCancelltionRequested: boolean;

		static get none(): CancellationToken
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
}