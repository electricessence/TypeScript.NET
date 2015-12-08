/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    function defer(task, delay) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var timeout = 0;
        var cancel = function () {
            if (timeout) {
                clearTimeout(timeout);
                timeout = 0;
                return true;
            }
            return false;
        };
        timeout = setTimeout(function () {
            cancel();
            task();
        }, delay);
        return cancel;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = defer;
});
//# sourceMappingURL=defer.js.map