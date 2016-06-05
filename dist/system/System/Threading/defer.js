/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var extends_1;
    var __extends, DeferBase, Defer, DeferInterval;
    function defer(task, delay, payload) {
        return new Defer(task, delay, payload);
    }
    exports_1("defer", defer);
    function interval(task, interval, count) {
        if (count === void 0) { count = Infinity; }
        return new DeferInterval(task, interval, count);
    }
    exports_1("interval", interval);
    return {
        setters:[
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            DeferBase = (function () {
                function DeferBase() {
                }
                DeferBase.prototype.dispose = function () {
                    this.cancel();
                };
                return DeferBase;
            }());
            Defer = (function (_super) {
                __extends(Defer, _super);
                function Defer(task, delay, payload) {
                    _super.call(this);
                    if (!(delay > 0))
                        delay = 0;
                    this._id = setTimeout(Defer.handler, delay, task, this, payload);
                }
                Defer.prototype.cancel = function () {
                    var id = this._id;
                    if (id) {
                        clearTimeout(id);
                        this._id = null;
                        return true;
                    }
                    return false;
                };
                Defer.handler = function (task, d, payload) {
                    d.cancel();
                    task(payload);
                };
                return Defer;
            }(DeferBase));
            DeferInterval = (function (_super) {
                __extends(DeferInterval, _super);
                function DeferInterval(task, interval, _remaining) {
                    if (_remaining === void 0) { _remaining = Infinity; }
                    _super.call(this);
                    this._remaining = _remaining;
                    if (interval === null || interval === void (0))
                        throw "'interval' must be a valid number.";
                    if (interval < 0)
                        throw "'interval' cannot be negative.";
                    this._id = setInterval(DeferInterval.handler, interval, task, this);
                }
                DeferInterval.prototype.cancel = function () {
                    var id = this._id;
                    if (id) {
                        clearInterval(id);
                        this._id = null;
                        return true;
                    }
                    return false;
                };
                DeferInterval.handler = function (task, d) {
                    if (!(--d._remaining))
                        d.cancel();
                    task();
                };
                return DeferInterval;
            }(DeferBase));
            exports_1("default",defer);
        }
    }
});
//# sourceMappingURL=defer.js.map