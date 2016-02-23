/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import Type from '../Types';
export function dispose(...disposables) {
    disposeTheseInternal(disposables, false);
}
export function disposeWithoutException(...disposables) {
    return disposeTheseInternal(disposables, true);
}
export function disposeThese(disposables, trapExceptions) {
    return disposables && disposables.length
        ? disposeTheseInternal(disposables.slice(), trapExceptions)
        : null;
}
export function using(disposable, closure) {
    try {
        return closure(disposable);
    }
    finally {
        disposeSingle(disposable, false);
    }
}
function disposeSingle(disposable, trapExceptions) {
    if (Type.of(disposable).member('dispose').isFunction) {
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
//# sourceMappingURL=Utility.js.map