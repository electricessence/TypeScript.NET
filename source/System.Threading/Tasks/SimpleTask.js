///<reference path="ITaskState.d.ts"/>
///<reference path="..\..\System\Promises\IPromise.d.ts"/>
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
    var SimpleTask = (function () {
        function SimpleTask(context, task, args) {
            this._context = context;
            this._task = task;
            this._args = args;
        }
        SimpleTask.prototype._okToRun = function () {
            var _ = this;
            if (_._status <= 2) {
                if (_._timeout)
                    clearTimeout(_._timeout);
                return true;
            }
            return false;
        };
        Object.defineProperty(SimpleTask.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SimpleTask.prototype, "result", {
            get: function () {
                return this._result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SimpleTask.prototype, "exception", {
            get: function () {
                return this._exception;
            },
            enumerable: true,
            configurable: true
        });
        SimpleTask.prototype.runSynchronous = function () {
            var _ = this;
            if (_._okToRun())
                _._status = 3;
            else
                return false;
            try {
                if (_._task)
                    _._result = _._task.apply(_._context, _._args);
                _._status = 6;
            }
            catch (ex) {
                _._status = 8;
                _._exception = ex;
            }
            _._task = null;
            return true;
        };
        SimpleTask.prototype.defer = function (delay) {
            var _ = this;
            if (_._okToRun())
                _._status = 2;
            else
                return false;
            _._timeout = setTimeout(function () { return _.runSynchronous(); }, delay);
            return true;
        };
        SimpleTask.prototype.cancel = function () {
            var _ = this;
            if (_._okToRun())
                _._status = 7;
            else
                return false;
            _._task = null;
            return true;
        };
        return SimpleTask;
    })();
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
        return new SimpleTask(context, task, args);
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