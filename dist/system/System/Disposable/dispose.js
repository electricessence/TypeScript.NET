/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Types"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1;
    var dispose;
    function dispose() {
        var disposables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            disposables[_i - 0] = arguments[_i];
        }
        disposeTheseInternal(disposables, false);
    }
    exports_1("dispose", dispose);
    function using(disposable, closure) {
        try {
            return closure(disposable);
        }
        finally {
            disposeSingle(disposable, false);
        }
    }
    exports_1("using", using);
    function disposeSingle(disposable, trapExceptions) {
        if (disposable && Types_1.Type.of(disposable).member('dispose').isFunction) {
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
    function disposeTheseInternal(disposables, trapExceptions, index) {
        if (index === void 0) { index = 0; }
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
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
            (function (dispose) {
                function deferred() {
                    var disposables = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        disposables[_i - 0] = arguments[_i];
                    }
                    these.deferred(disposables);
                }
                dispose.deferred = deferred;
                function withoutException() {
                    var disposables = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        disposables[_i - 0] = arguments[_i];
                    }
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
                    function deferred(disposables, delay) {
                        if (delay === void 0) { delay = 0; }
                        if (disposables && disposables.length) {
                            if (!(delay >= 0))
                                delay = 0;
                            setTimeout(disposeTheseInternal, delay, disposables.slice(), true);
                        }
                    }
                    these.deferred = deferred;
                })(these = dispose.these || (dispose.these = {}));
            })(dispose = dispose || (dispose = {}));
            exports_1("dispose", dispose);
            exports_1("default",dispose);
        }
    }
});
//# sourceMappingURL=dispose.js.map