/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    ///<reference path="ISimpleTask.d.ts"/>
    ///<reference path="TaskStatus.d.ts"/>
    var VOID0 = void 0;
    var STATUS = 'status';
    var RESULT = 'result';
    function create(task) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return applyInternal(null, task, args);
    }
    exports.create = create;
    function apply(context, task) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return applyInternal(context, task, args);
    }
    exports.apply = apply;
    function applyInternal(context, task, args) {
        var status = 0;
        var timeout = 0;
        var taskResult;
        var okToRun = function () {
            if (status <= 2) {
                if (timeout)
                    clearTimeout(timeout);
                return true;
            }
            return false;
        };
        var cancel = function () {
            var ok = okToRun();
            if (ok)
                status = 7;
            task = null;
            return ok;
        };
        var run = function () {
            if (okToRun())
                status = 3;
            else
                return false;
            try {
                if (task)
                    taskResult = task.apply(context, args);
                status = 6;
            }
            catch (ex) {
                status = 8;
            }
            task = null;
            return true;
        };
        var defer = function (delay) {
            if (okToRun())
                status = 2;
            else
                return false;
            timeout = setTimeout(run, delay);
            return true;
        };
        var result = {
            status: VOID0,
            result: VOID0,
            cancel: cancel,
            defer: defer,
            runSynchronous: run
        };
        Object.defineProperty(result, STATUS, {
            get: function () { return status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(result, RESULT, {
            get: function () { return taskResult; },
            enumerable: true,
            configurable: true
        });
        return Object.freeze(result);
    }
    function defer(task, delay) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var t = applyInternal(null, task, args);
        t.defer(delay);
        return t;
    }
    exports.defer = defer;
});
//# sourceMappingURL=SimpleTask.js.map