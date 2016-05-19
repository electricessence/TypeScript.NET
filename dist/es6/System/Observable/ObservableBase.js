/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import { SubscribableBase } from "./SubscribableBase";
export class ObservableBase extends SubscribableBase {
    _onNext(value) {
        processAction(this._getSubscribers(), s => { s.onNext && s.onNext(value); });
    }
    _onError(error) {
        processAction(this._getSubscribers(), s => { s.onError && s.onError(error); });
    }
    _onCompleted() {
        processAction(this._unsubscribeAll(true), s => { s.onCompleted && s.onCompleted(); });
    }
}
const OBSERVER_ERROR_MESSAGE = 'One or more observers had errors when attempting to pass information.';
function processAction(observers, handler) {
    var observersErrors = null;
    for (let s of observers) {
        try {
            handler(s);
        }
        catch (ex) {
            observersErrors = observersErrors || [];
            observersErrors.push({ observer: s, ex: ex });
        }
    }
    observers.length = 0;
    if (observersErrors && observersErrors.length) {
        if (console && console.error)
            console.error(OBSERVER_ERROR_MESSAGE, observersErrors);
        else
            throw {
                message: OBSERVER_ERROR_MESSAGE,
                errors: observersErrors
            };
    }
}
export default ObservableBase;
//# sourceMappingURL=ObservableBase.js.map