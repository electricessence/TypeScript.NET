/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Disposable/DisposableBase"], function(exports_1, context_1) {
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
                    this._id = null;
                }
                Object.defineProperty(TaskHandlerBase.prototype, "isScheduled", {
                    get: function () {
                        return !!this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                TaskHandlerBase.prototype.execute = function (defer) {
                    this.cancel();
                    if (isNaN(defer) || defer < 0) {
                        this._onExecute();
                    }
                    else if (isFinite(defer)) {
                        this._id = setTimeout(TaskHandlerBase._handler, defer, this);
                    }
                };
                TaskHandlerBase._handler = function (d) {
                    d.cancel();
                    d._onExecute();
                };
                TaskHandlerBase.prototype._onDispose = function () {
                    this.cancel();
                };
                TaskHandlerBase.prototype.cancel = function () {
                    var id = this._id;
                    if (id) {
                        clearTimeout(id);
                        this._id = null;
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