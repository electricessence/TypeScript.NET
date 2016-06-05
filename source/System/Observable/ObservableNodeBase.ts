/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */

// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
import ObservableBase from "./ObservableBase";
import {IObserver} from "./IObserver";
import __extendsImport from "../../extends";
const __extends = __extendsImport;

export class ObservableNodeBase<T>
extends ObservableBase<T>
implements IObserver<T>
{

	onNext(value:T):void
	{
		this._onNext(value);
	}

	onError(error:Error):void
	{
		this._onError(error);
	}

	onCompleted():void
	{
		this._onCompleted();
	}
}

export default ObservableNodeBase;