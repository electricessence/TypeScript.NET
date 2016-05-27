/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Disposable/DisposableBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var DisposableBase_1;
    var TaskHandlerBase;
    return {
        setters:[
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            }],
        execute: function() {
            TaskHandlerBase = (function (_super) {
                __extends(TaskHandlerBase, _super);
                function TaskHandlerBase() {
                    _super.call(this);
                    this._timeoutId = null;
                    this._status = 0;
                }
                Object.defineProperty(TaskHandlerBase.prototype, "isScheduled", {
                    get: function () {
                        return !!this._timeoutId;
                    },
                    enumerable: true,
                    configurable: true
                });
                TaskHandlerBase.prototype.start = function (defer) {
                    this.throwIfDisposed();
                    this.cancel();
                    this._status = 1;
                    if (!(defer > 0))
                        defer = 0;
                    if (isFinite(defer))
                        this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
                };
                TaskHandlerBase.prototype.runSynchronously = function () {
                    this.throwIfDisposed();
                    TaskHandlerBase._handler(this);
                };
                TaskHandlerBase.prototype.getStatus = function () {
                    return this._status;
                };
                Object.defineProperty(TaskHandlerBase.prototype, "status", {
                    get: function () {
                        return this.getStatus();
                    },
                    enumerable: true,
                    configurable: true
                });
                TaskHandlerBase._handler = function (d) {
                    d.cancel();
                    d._status = 2;
                    try {
                        d._onExecute();
                        d._status = 3;
                    }
                    catch (ex) {
                        d._status = 5;
                    }
                };
                TaskHandlerBase.prototype._onDispose = function () {
                    this.cancel();
                    this._status = null;
                };
                TaskHandlerBase.prototype.cancel = function () {
                    var id = this._timeoutId;
                    if (id) {
                        clearTimeout(id);
                        this._timeoutId = null;
                        this._status = 4;
                        return true;
                    }
                    return false;
                };
                return TaskHandlerBase;
            }(DisposableBase_1.DisposableBase));
            exports_1("TaskHandlerBase", TaskHandlerBase);
            exports_1("default",TaskHandlerBase);
        }
    }
});
//# sourceMappingURL=TaskHandlerBase.js.map