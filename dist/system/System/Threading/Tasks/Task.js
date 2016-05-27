/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./TaskHandlerBase", "../../Exceptions/ArgumentNullException", "../../Lazy"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TaskHandlerBase_1, ArgumentNullException_1, Lazy_1;
    var Task;
    return {
        setters:[
            function (TaskHandlerBase_1_1) {
                TaskHandlerBase_1 = TaskHandlerBase_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (Lazy_1_1) {
                Lazy_1 = Lazy_1_1;
            }],
        execute: function() {
            Task = (function (_super) {
                __extends(Task, _super);
                function Task(valueFactory) {
                    _super.call(this);
                    if (!valueFactory)
                        throw new ArgumentNullException_1.ArgumentNullException('valueFactory');
                    this._result = new Lazy_1.Lazy(valueFactory, false);
                }
                Task.prototype._onExecute = function () {
                    this._result.getValue();
                };
                Task.prototype.getResult = function () {
                    return this._result.value;
                };
                Task.prototype.getState = function () {
                    var r = this._result;
                    return r && {
                        status: this.getStatus(),
                        result: r.isValueCreated ? r.value : void 0,
                        error: r.error
                    };
                };
                Task.prototype.start = function (defer) {
                    if (this.getStatus() == 0) {
                        _super.prototype.start.call(this, defer);
                    }
                };
                Task.prototype.runSynchronously = function () {
                    if (this.getStatus() == 0) {
                        _super.prototype.runSynchronously.call(this);
                    }
                };
                Object.defineProperty(Task.prototype, "state", {
                    get: function () {
                        return this.getState();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Task.prototype, "result", {
                    get: function () {
                        this.throwIfDisposed();
                        this.runSynchronously();
                        return this.getResult();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Task.prototype, "error", {
                    get: function () {
                        this.throwIfDisposed();
                        return this._result.error;
                    },
                    enumerable: true,
                    configurable: true
                });
                Task.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    var r = this._result;
                    if (r) {
                        this._result = null;
                        r.dispose();
                    }
                };
                return Task;
            }(TaskHandlerBase_1.TaskHandlerBase));
            exports_1("Task", Task);
            exports_1("default",Task);
        }
    }
});
//# sourceMappingURL=Task.js.map