/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Disposable/DisposableBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var TaskHandlerBase = (function (_super) {
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
    }(DisposableBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskHandlerBase;
});
//# sourceMappingURL=TaskHandlerBase.js.map