///<reference path="IDisposable.ts"/>
define(["require", "exports", './Types'], function (require, exports, Types) {
    /// Disposable Utility
    var Utility;
    (function (Utility) {
        function dispose() {
            var disposables = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                disposables[_i - 0] = arguments[_i];
            }
            disposeTheseInternal(disposables, false);
        }
        Utility.dispose = dispose;
        function disposeWithoutException() {
            var disposables = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                disposables[_i - 0] = arguments[_i];
            }
            disposeTheseInternal(disposables, true);
        }
        Utility.disposeWithoutException = disposeWithoutException;
        // Using this function will make it more robust when there's no type checking.
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
            // Get the next non-null entry.
            while (disposables.length && !(next = disposables.shift())) { } // TODO: avoid .shift()
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
        Utility.disposeThese = disposeThese;
        function using(disposable, closure) {
            try {
                return closure(disposable);
            }
            finally {
                dispose(disposable);
            }
        }
        Utility.using = using;
    })(Utility || (Utility = {}));
    return Utility;
});
//# sourceMappingURL=Utility.js.map