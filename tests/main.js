///<reference path="../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './Arrays/_all', './Enumerable/_all', "QUnit"], function (require, exports, ArrayTests, EnumerableTests) {
    ArrayTests();
    EnumerableTests();
    QUnit.start();
});
//# sourceMappingURL=main.js.map