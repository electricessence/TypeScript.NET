System.register(["../Observable/ObservableBase", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ObservableBase_1, extends_1, __extends, ps, NodeJSWorker;
    return {
        setters: [
            function (ObservableBase_1_1) {
                ObservableBase_1 = ObservableBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            ps = require("child_process");
            //import {ChildProcess} from "child_process";
            /**
             * This class takes the place of a WebWorker
             */
            NodeJSWorker = (function (_super) {
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
            exports_1("NodeJSWorker", NodeJSWorker);
            exports_1("default", NodeJSWorker);
        }
    };
});
//# sourceMappingURL=NodeJSWorker.js.map