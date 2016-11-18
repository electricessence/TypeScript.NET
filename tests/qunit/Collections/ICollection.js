(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "QUnit", "../../../dist/amd/System/Text/Utility", "../../../dist/amd/System/Collections/Array/Utility", "../../../dist/amd/System/Exceptions/NotImplementedException"], function (require, exports) {
    "use strict";
    var Text = require("../../../dist/amd/System/Text/Utility");
    var AU = require("../../../dist/amd/System/Collections/Array/Utility");
    var NotImplementedException_1 = require("../../../dist/amd/System/Exceptions/NotImplementedException");
    function assertIsNumber(assert, value, name) {
        assert.ok(!isNaN(value), Text.format("'{0}' must be a real number.", name));
    }
    function assertAdding(assert, c, a) {
        var count;
        for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
            var v = a_1[_i];
            assertIsNumber(assert, count = c.count, 'count');
            c.add(v);
            assertIsNumber(assert, c.count, 'count');
            assert.equal(c.count, count + 1, "'count' should increment after adding.");
            assert.ok(c.contains(v), "'value' must exist after adding.");
        }
    }
    function assertCopyToClear(assert, c) {
        var count;
        assertIsNumber(assert, count = c.count, 'count');
        if (c.count < 2)
            throw "Can't assert '.copyTo()' or '.clear()' without at least (2) entries.";
        var a = [];
        c.copyTo(a);
        assertIsNumber(assert, c.count, 'count');
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
    }
    function assertRemoving(assert, c) {
        var count;
        assertIsNumber(assert, count = c.count, 'count');
        if (c.count < 2)
            throw "Can't assert '.remove()' without at least (2) entries.";
        var a = [];
        c.copyTo(a);
        assertIsNumber(assert, c.count, 'count');
        try {
            for (var _i = 0, a_4 = a; _i < a_4.length; _i++) {
                var v = a_4[_i];
                count -= c.remove(v);
                assertIsNumber(assert, c.count, 'count');
                assert.equal(c.count, count, "'count' should increment after removing.");
                assert.ok(!c.contains(v), "'value' must not exist after removing.");
            }
        }
        catch (ex) {
            if ((ex) instanceof (NotImplementedException_1.default)) {
                console.log(ex);
            }
            else {
                throw ex;
            }
        }
    }
    function Collection(name, collection, sourceValues) {
        if (sourceValues.indexOf(null) != -1)
            throw "Source values should not contain null as checking against null is one of the tests.";
        QUnit.test(name, function (assert) {
            assertAdding(assert, collection, sourceValues);
            assertCopyToClear(assert, collection);
            assertRemoving(assert, collection);
            assert.ok(!collection.contains(null), 'Equality comparison is not strict.');
        });
        QUnit.test(name + ".linqAsync()", function (assert) {
            var accept = assert.async();
            collection.linqAsync(function (linq) {
                assert.ok(!!linq, "Expects a linq enumerable instance.");
                assert.ok(!!collection.linq, "Expects a linq enumerable instance.");
                accept();
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
});
//# sourceMappingURL=ICollection.js.map