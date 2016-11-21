System.register(["../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function defer(task, delay, payload) {
        return new Defer(task, delay, payload);
    }
    exports_1("defer", defer);
    function interval(task, interval, count) {
        if (count === void 0) { count = Infinity; }
        return new DeferInterval(task, interval, count);
    }
    exports_1("interval", interval);
    var extends_1, __extends, DeferBase, Defer, DeferInterval;
    return {
        setters: [
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            // noinspection JSUnusedLocalSymbols
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
                    var _this = _super.call(this) || this;
                    if (!(delay > 0))
                        delay = 0; // covers undefined and null.
                    _this._id = setTimeout(Defer.handler, delay, task, _this, payload);
                    return _this;
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
                // Use a static function here to avoid recreating a new function every time.
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
                    var _this = _super.call(this) || this;
                    _this._remaining = _remaining;
                    if (interval === null || interval === void (0))
                        throw "'interval' must be a valid number.";
                    if (interval < 0)
                        throw "'interval' cannot be negative.";
                    _this._id = setInterval(DeferInterval.handler, interval, task, _this);
                    return _this;
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
            exports_1("default", defer);
        }
    };
});
//# sourceMappingURL=defer.js.map