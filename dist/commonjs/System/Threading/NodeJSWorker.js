"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObservableBase_1 = require("../Observable/ObservableBase");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var ps = require("child_process");
//import {ChildProcess} from "child_process";
/**
 * This class takes the place of a WebWorker
 */
var NodeJSWorker = /** @class */ (function (_super) {
    __extends(NodeJSWorker, _super);
    function NodeJSWorker(url) {
        var _this = _super.call(this) || this;
        var process = _this._process = ps.fork(url);
        process.on('message', function (msg) { return _this._onNext(JSON.parse(msg)); });
        process.on('error', function (err) { return _this._onError(err); });
        return _this;
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
        this._process.removeAllListeners(); // just to satisfy paranoia.
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
exports.default = NodeJSWorker;
//# sourceMappingURL=NodeJSWorker.js.map