/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/Worker.js
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Observable/ObservableBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ObservableBase_1 = require("../Observable/ObservableBase");
    var ps = require("child_process");
    var NodeJSWorker = (function (_super) {
        __extends(NodeJSWorker, _super);
        function NodeJSWorker(url) {
            var _this = this;
            _super.call(this);
            var process = this._process = ps.fork(url);
            process.on('message', function (msg) { return _this._onNext(JSON.parse(msg)); });
            process.on('error', function (err) { return _this._onError(err); });
        }
        NodeJSWorker.prototype._onNext = function (data) {
            _super.prototype._onNext.call(this, data);
            if (this.onmessage)
                this.onmessage({ data: data });
        };
        NodeJSWorker.prototype._onError = function (error) {
            _super.prototype._onError.call(this, error);
            if (this.onerror)
                this.onerror(error);
        };
        NodeJSWorker.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._process.removeAllListeners();
            this._process.kill();
            this._process = null;
        };
        NodeJSWorker.prototype.postMessage = function (obj) {
            this.throwIfDisposed();
            this._process.send(JSON.stringify({ data: obj }));
        };
        NodeJSWorker.prototype.terminate = function () {
            this.dispose();
        };
        return NodeJSWorker;
    }(ObservableBase_1.ObservableBase));
    exports.NodeJSWorker = NodeJSWorker;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NodeJSWorker;
});
//# sourceMappingURL=NodeJSWorker.js.map