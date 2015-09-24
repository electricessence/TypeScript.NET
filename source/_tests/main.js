///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './Arrays/tests', './Enumerable/tests', "QUnit"], function (require, exports, ArrayUtilityTests, EnumerableTests) {
    ArrayUtilityTests();
    EnumerableTests();
    QUnit.start();
});
//# sourceMappingURL=main.js.map