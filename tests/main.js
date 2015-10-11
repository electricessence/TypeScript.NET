///<reference path="../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './Arrays/_all', './Collections/_all', './Linq/_all', './Uri/_all', "QUnit"], function (require, exports, ArrayTests, CollectionTests, EnumerableTests, UriTests) {
    UriTests();
    ArrayTests();
    CollectionTests();
    EnumerableTests();
    QUnit.start();
});
//# sourceMappingURL=main.js.map