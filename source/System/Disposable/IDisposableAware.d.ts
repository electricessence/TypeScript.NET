/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IDisposable.d.ts"/>

interface IDisposableAware extends IDisposable
{
	wasDisposed: boolean;
}
