///<reference path="IDisposable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

interface IDisposableAware extends IDisposable
{
	wasDisposed: boolean;
}
