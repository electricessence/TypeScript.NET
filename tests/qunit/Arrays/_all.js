///<reference path="../../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "QUnit", './Utility', './Procedure', './Compare'], function (require, exports) {
    var Utility_1 = require('./Utility');
    var Procedure_1 = require('./Procedure');
    var Compare_1 = require('./Compare');
    function run() {
        Utility_1.default();
        Procedure_1.default();
        Compare_1.default();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});

//# sourceMappingURL=_all.js.map
