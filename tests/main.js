///<reference path="../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './Arrays/_all', './Collections/_all', './Enumerable/_all', "QUnit"], function (require, exports, ArrayTests, CollectionTests, EnumerableTests) {
    ArrayTests();
    CollectionTests();
    EnumerableTests();
    QUnit.start();
});
//# sourceMappingURL=main.js.map