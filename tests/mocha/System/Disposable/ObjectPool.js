(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../source/System/Disposable/ObjectPool"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ObjectPool_1 = require("../../../../source/System/Disposable/ObjectPool");
    var assert = require('../../../../node_modules/assert/assert');
    var pool = new ObjectPool_1.default(40, function () { return new Array(100); });
});
//# sourceMappingURL=ObjectPool.js.map