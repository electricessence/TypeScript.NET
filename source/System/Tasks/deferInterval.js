/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function deferInterval(task, interval, count) {
        if (count === void 0) { count = Infinity; }
        if (!(interval >= 0))
            interval = 0;
        var id = 0;
        var cancel = function () {
            if (id) {
                clearInterval(id);
                id = 0;
                return true;
            }
            return false;
        };
        cancel.dispose = cancel.cancel = cancel;
        id = setInterval(function () {
            if (!(--count))
                cancel();
            task();
        }, interval);
        return cancel;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = deferInterval;
});
//# sourceMappingURL=deferInterval.js.map