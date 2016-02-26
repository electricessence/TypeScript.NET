(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var SimpleNetAdapterBase = (function () {
        function SimpleNetAdapterBase() {
        }
        return SimpleNetAdapterBase;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimpleNetAdapterBase;
});
//# sourceMappingURL=SimpleNetAdapterBase.js.map