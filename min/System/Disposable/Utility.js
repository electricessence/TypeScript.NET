///<reference path="IDisposable.d.ts"/>
var Types = require('../Types');
var DisposableUtility;
(function (DisposableUtility) {
    function dispose() {
        var disposables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            disposables[_i - 0] = arguments[_i];
        }
        disposeTheseInternal(disposables, false);
    }
    DisposableUtility.dispose = dispose;
    function disposeWithoutException() {
        var disposables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            disposables[_i - 0] = arguments[_i];
        }
        disposeTheseInternal(disposables, true);
    }
    DisposableUtility.disposeWithoutException = disposeWithoutException;
    function disposeSingle(disposable, ignoreExceptions) {
        if (disposable && typeof disposable.dispose == Types.Function) {
            if (ignoreExceptions) {
                try {
                    disposable.dispose();
                }
                catch (ex) {
                }
            }
            else
                disposable.dispose();
        }
    }
    function disposeTheseInternal(disposables, ignoreExceptions) {
        var next;
        while (disposables.length && !(next = disposables.shift())) { }
        if (next) {
            try {
                disposeSingle(next, ignoreExceptions);
            }
            finally {
                disposeTheseInternal(disposables, ignoreExceptions);
            }
        }
    }
    function disposeThese(disposables, ignoreExceptions) {
        if (disposables && disposables.length)
            disposeTheseInternal(disposables.slice(0), ignoreExceptions);
    }
    DisposableUtility.disposeThese = disposeThese;
    function using(disposable, closure) {
        try {
            return closure(disposable);
        }
        finally {
            dispose(disposable);
        }
    }
    DisposableUtility.using = using;
})(DisposableUtility || (DisposableUtility = {}));
module.exports = DisposableUtility;
