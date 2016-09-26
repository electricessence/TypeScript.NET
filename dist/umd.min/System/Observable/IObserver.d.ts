/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */

import {Action, Closure} from "../FunctionTypes";
export interface IObserver<T>
{
	// onNext is optional because an observer may only care about onCompleted.
	onNext?:Action<T>;
	onError?:Action<any>;
	onCompleted?:Closure;
}

export default IObserver;