/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.dispose = dispose;
exports.disposeWithoutException = disposeWithoutException;
exports.disposeThese = disposeThese;
exports.using = using;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

'use strict';

function dispose() {
    for (var _len = arguments.length, disposables = Array(_len), _key = 0; _key < _len; _key++) {
        disposables[_key] = arguments[_key];
    }

    disposeTheseInternal(disposables, false);
}

function disposeWithoutException() {
    for (var _len2 = arguments.length, disposables = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        disposables[_key2] = arguments[_key2];
    }

    return disposeTheseInternal(disposables, true);
}

function disposeThese(disposables, trapExceptions) {
    return disposables && disposables.length ? disposeTheseInternal(disposables.slice(), trapExceptions) : null;
}

function using(disposable, closure) {
    try {
        return closure(disposable);
    } finally {
        disposeSingle(disposable, false);
    }
}

function disposeSingle(disposable, trapExceptions) {
    if (_Types2['default'].of(disposable).member('dispose').isFunction) {
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
//# sourceMappingURL=Utility.js.map
