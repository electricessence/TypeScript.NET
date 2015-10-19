///<reference path="../../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './Utility', './Procedure', './Compare', "QUnit"], function (require, exports, Utility_1, Procedure_1, Compare_1) {
    function run() {
        Utility_1.default();
        Procedure_1.default();
        Compare_1.default();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});

//# sourceMappingURL=_all.js.map
