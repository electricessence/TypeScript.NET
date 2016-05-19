/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
export function dispose(...disposables) {
    disposeTheseInternal(disposables, false);
}
export var dispose;
(function (dispose) {
    function deferred(...disposables) {
        these.deferred(disposables);
    }
    dispose.deferred = deferred;
    function withoutException(...disposables) {
        return disposeTheseInternal(disposables, true);
    }
    dispose.withoutException = withoutException;
    function these(disposables, trapExceptions) {
        return disposables && disposables.length
            ? disposeTheseInternal(disposables.slice(), trapExceptions)
            : null;
    }
    dispose.these = these;
    var these;
    (function (these) {
        function deferred(disposables, delay = 0) {
            if (disposables && disposables.length) {
                if (!(delay >= 0))
                    delay = 0;
                setTimeout(disposeTheseInternal, delay, disposables.slice(), true);
            }
        }
        these.deferred = deferred;
    })(these = dispose.these || (dispose.these = {}));
})(dispose || (dispose = {}));
export function using(disposable, closure) {
    try {
        return closure(disposable);
    }
    finally {
        disposeSingle(disposable, false);
    }
}
function disposeSingle(disposable, trapExceptions) {
    if (disposable && Type.of(disposable).member('dispose').isFunction) {
        if (trapExceptions) {
            try {
                disposable.dispose();
            }
            catch (ex) {
                return ex;
            }
        }
        else
            disposable.dispose();
    }
    return null;
}
function disposeTheseInternal(disposables, trapExceptions, index = 0) {
    var exceptions;
    var len = disposables.length;
    for (; index < len; index++) {
        var next = disposables[index];
        if (!next)
            continue;
        if (trapExceptions) {
            var ex = disposeSingle(next, true);
            if (ex) {
                if (!exceptions)
                    exceptions = [];
                exceptions.push(ex);
            }
        }
        else {
            var success = false;
            try {
                disposeSingle(next, false);
                success = true;
            }
            finally {
                if (!success && index + 1 < len) {
                    disposeTheseInternal(disposables, false, index + 1);
                }
            }
            if (!success)
                break;
        }
    }
    return exceptions;
}
export default dispose;
//# sourceMappingURL=dispose.js.map