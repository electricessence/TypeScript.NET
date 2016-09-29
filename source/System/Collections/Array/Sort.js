(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Sort/createComparer", "./Sort/quickSort"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    var createComparer_1 = require("./Sort/createComparer");
    exports.createComparer = createComparer_1.createComparer;
    exports.default = createComparer_1.createComparer;
    exports.by = createComparer_1.createComparer;
    __export(require("./Sort/quickSort"));
});
//# sourceMappingURL=Sort.js.map