"use strict";
var AU = require("../../../../dist/commonjs/System/Collections/Array/Utility");
var NotImplementedException_1 = require("../../../../dist/commonjs/System/Exceptions/NotImplementedException");
var assert = require('../../../../node_modules/assert/assert');
function General(collection) {
    var count = collection.count;
    describe(".count", function () {
        assertIsNumber(count);
    });
}
exports.General = General;
function assertIsNumber(value, message) {
    if (message === void 0) { message = "should be a real number"; }
    assert.ok(!isNaN(value), message);
}
function assertAdding(c, a) {
    it(".add(value)", function () {
        var count;
        for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
            var v = a_1[_i];
            assertIsNumber(count = c.count, "before adding");
            c.add(v);
            assertIsNumber(c.count, "after adding");
            assert.equal(c.count, count + 1, "count should have incremented");
            assert.ok(c.contains(v), "'value' must exist after adding");
        }
    });
}
function assertCopyToClear(c) {
    it(".copyTo(other) & .clear()", function () {
        var count = c.count;
        assertIsNumber(count);
        if (count < 2)
            throw "Can't assert '.copyTo()' or '.clear()' without at least (2) entries.";
        var a = [];
        c.copyTo(a);
        assertIsNumber(c.count, 'count');
        assert.equal(a.length, count, "An empty array's length should match the count if copied to.");
        c.clear();
        assert.equal(c.count, 0, "A collection's count should be zero after calling '.clear()'.");
        for (var _i = 0, a_2 = a; _i < a_2.length; _i++) {
            var v = a_2[_i];
            c.add(v);
        }
        var extraSize = 10;
        var b = AU.initialize(count + extraSize);
        c.copyTo(b, 1);
        assert.equal(b.length, count + extraSize, "An array's length should be equal to it's original length if the count added does not exceed the length.");
        c.copyTo(b, count + extraSize - 1);
        assert.equal(b.length, 2 * count + extraSize - 1, "An array's length should be equal to index+count if the count exceeds the length.");
        c.clear();
        assert.equal(c.count, 0, "A collection's count should be zero after calling '.clear()'.");
        for (var _a = 0, a_3 = a; _a < a_3.length; _a++) {
            var v = a_3[_a];
            c.add(v);
        }
        assert.equal(c.count, a.length, "A collection's count should be equal to the number of items added.");
    });
}
function assertRemoving(c) {
    it(".remove(values)", function () {
        var count;
        assertIsNumber(count = c.count);
        if (c.count < 2)
            throw "Can't assert '.remove()' without at least (2) entries.";
        var a = [];
        c.copyTo(a);
        assertIsNumber(c.count);
        try {
            for (var _i = 0, a_4 = a; _i < a_4.length; _i++) {
                var v = a_4[_i];
                count -= c.remove(v);
                assertIsNumber(c.count, "after removing");
                assert.equal(c.count, count, "'count' should increment after removing.");
                assert.ok(!c.contains(v), "'value' must not exist after removing.");
            }
        }
        catch (ex) {
            if ((ex) instanceof (NotImplementedException_1.default)) {
            }
            else {
                throw ex;
            }
        }
    });
}
function Collection(name, collection, sourceValues) {
    if (sourceValues.indexOf(null) != -1)
        throw "Source values should not contain null as checking against null is one of the tests.";
    describe(name, function () {
        assertAdding(collection, sourceValues);
        assertCopyToClear(collection);
        assertRemoving(collection);
        it("equality comparison should be strict", function () {
            assert.ok(!collection.contains(null));
        });
    });
}
exports.Collection = Collection;
function StringCollection(name, collection) {
    Collection(name + '<' + 'string>', collection, [
        "",
        "lorem",
        "ipsum",
        "dolem",
        "ipsum"
    ]);
}
exports.StringCollection = StringCollection;
function NumberCollection(name, collection) {
    Collection(name + '<' + 'number>', collection, [
        0,
        1,
        1,
        2,
        3,
        5,
        8,
        NaN
    ]);
}
exports.NumberCollection = NumberCollection;
function InstanceCollection(name, collection) {
    var repeat = {};
    Collection(name + '<' + 'Object>', collection, [
        undefined,
        {},
        repeat,
        {},
        repeat
    ]);
}
exports.InstanceCollection = InstanceCollection;
//# sourceMappingURL=ICollection.js.map