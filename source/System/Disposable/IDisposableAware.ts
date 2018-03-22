/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import IDisposable from "./IDisposable";
export {IDisposable}

export default interface IDisposableAware extends IDisposable
{
	wasDisposed:boolean;
}
