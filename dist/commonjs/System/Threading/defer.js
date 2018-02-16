"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var DeferBase = /** @class */ (function () {
    function DeferBase() {
    }
    DeferBase.prototype.dispose = function () {
        this.cancel();
    };
    return DeferBase;
}());
var Defer = /** @class */ (function (_super) {
    __extends(Defer, _super);
    function Defer(task, delay, payload) {
        if (delay === void 0) { delay = 0; }
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
var DeferInterval = /** @class */ (function (_super) {
    __extends(DeferInterval, _super);
    function DeferInterval(task, interval, _remaining) {
        if (_remaining === void 0) { _remaining = Infinity; }
        var _this = _super.call(this) || this;
        _this._remaining = _remaining;
        if (interval == null)
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
function defer(task, delay, payload) {
    return new Defer(task, delay, payload);
}
exports.defer = defer;
function interval(task, interval, count) {
    if (count === void 0) { count = Infinity; }
    return new DeferInterval(task, interval, count);
}
exports.interval = interval;
exports.default = defer;
//# sourceMappingURL=defer.js.map