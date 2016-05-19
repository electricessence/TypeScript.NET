/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var Types_1 = require("../Types");
function dispose() {
    for (var _len = arguments.length, disposables = Array(_len), _key = 0; _key < _len; _key++) {
        disposables[_key] = arguments[_key];
    }

    disposeTheseInternal(disposables, false);
}
exports.dispose = dispose;
var dispose;
(function (dispose) {
    function deferred() {
        for (var _len2 = arguments.length, disposables = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            disposables[_key2] = arguments[_key2];
        }

        these.deferred(disposables);
    }
    dispose.deferred = deferred;
    function withoutException() {
        for (var _len3 = arguments.length, disposables = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            disposables[_key3] = arguments[_key3];
        }

        return disposeTheseInternal(disposables, true);
    }
    dispose.withoutException = withoutException;
    function these(disposables, trapExceptions) {
        return disposables && disposables.length ? disposeTheseInternal(disposables.slice(), trapExceptions) : null;
    }
    dispose.these = these;
    var these;
    (function (these) {
        function deferred(disposables) {
            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (disposables && disposables.length) {
                if (!(delay >= 0)) delay = 0;
                setTimeout(disposeTheseInternal, delay, disposables.slice(), true);
            }
        }
        these.deferred = deferred;
    })(these = dispose.these || (dispose.these = {}));
})(dispose = exports.dispose || (exports.dispose = {}));
function using(disposable, closure) {
    try {
        return closure(disposable);
    } finally {
        disposeSingle(disposable, false);
    }
}
exports.using = using;
function disposeSingle(disposable, trapExceptions) {
    if (disposable && Types_1.Type.of(disposable).member('dispose').isFunction) {
        if (trapExceptions) {
            try {
                disposable.dispose();
            } catch (ex) {
                return ex;
            }
        } else disposable.dispose();
    }
    return null;
}
function disposeTheseInternal(disposables, trapExceptions) {
    var index = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    var exceptions;
    var len = disposables.length;
    for (; index < len; index++) {
        var next = disposables[index];
        if (!next) continue;
        if (trapExceptions) {
            var ex = disposeSingle(next, true);
            if (ex) {
                if (!exceptions) exceptions = [];
                exceptions.push(ex);
            }
        } else {
            var success = false;
            try {
                disposeSingle(next, false);
                success = true;
            } finally {
                if (!success && index + 1 < len) {
                    disposeTheseInternal(disposables, false, index + 1);
                }
            }
            if (!success) break;
        }
    }
    return exceptions;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dispose;
//# sourceMappingURL=dispose.js.map
