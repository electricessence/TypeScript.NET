import { Type } from "../Types";
export function dispose(...disposables) {
    disposeTheseInternal(disposables, false);
}
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
            : void 0;
    }
    dispose.these = these;
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
    if (disposable
        && Type.of(disposable)
            .member('dispose')
            .isFunction) {
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
    let exceptions;
    const len = disposables ? disposables.length : 0;
    for (; index < len; index++) {
        let next = disposables[index];
        if (!next)
            continue;
        if (trapExceptions) {
            const ex = disposeSingle(next, true);
            if (ex) {
                if (!exceptions)
                    exceptions = [];
                exceptions.push(ex);
            }
        }
        else {
            let success = false;
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