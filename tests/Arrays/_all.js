///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './Utility', './Procedure', './Compare', "QUnit"], function (require, exports, Utility, Procedure, Compare) {
    function run() {
        Utility();
        Procedure();
        Compare();
    }
    return run;
});
//# sourceMappingURL=_all.js.map