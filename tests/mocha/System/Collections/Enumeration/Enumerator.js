"use strict";
var Types_1 = require("../../../../../dist/commonjs/System/Types");
var Queue_1 = require("../../../../../dist/commonjs/System/Collections/Queue");
var Enumerator = require("../../../../../dist/commonjs/System/Collections/Enumeration/Enumerator");
var assert = require('../../../../../node_modules/assert/assert');
var VOID0 = void (0);
describe(".from(source)", function () {
    it("null should use an empty enumerator", function () {
        var test = Enumerator.from(null), count = 0;
        while (test.moveNext()) {
            count++;
        }
        assert.equal(test.current, VOID0);
        assert.equal(test.nextValue(), VOID0);
        assert.equal(test.next().done, true);
        assert.equal(count, 0);
        test.reset();
        test.dispose();
    });
    it("primitive values should throw", function () {
        assert.throws(function () { return Enumerator.from(1); });
    });
    it("non enumerable objects should throw", function () {
        assert.throws(function () { return Enumerator.from({}); });
    });
    it("functions should be treated as generators", function () {
        var e = Enumerator.from(function (prev, i) { return (prev || 1) + i; });
        function pass(e) {
            assert.equal(e.nextValue(), 1);
            assert.equal(e.nextValue(), 2);
            assert.equal(e.nextValue(), 4);
            assert.equal(e.nextValue(), 7);
            assert.equal(e.nextValue(), 11);
            assert.equal(e.nextValue(), 16);
        }
        pass(e);
        e.reset();
        pass(e);
        e.dispose();
        assert.ok(!e.moveNext());
        assert.equal(e.nextValue(), void 0);
    });
    it("IEnumerable should enumerate", function () {
        var a = [0, 1, 2, 3, 4];
        var len = a.length, count = 0;
        var q = new Queue_1.default(a);
        var type = new Types_1.TypeInfo(q);
        type.member("getEnumerator");
        var test = Enumerator.from({ getEnumerator: function () { return Enumerator.from(a); } });
        while (test.moveNext()) {
            count++;
        }
        assert.equal(count, len);
    });
    it("arrays should enumerate", function () {
        var a = [0, 1, 2, 3, 4];
        var type = new Types_1.TypeInfo(a);
        type.member("length");
        var len = a.length, count = 0;
        var test = Enumerator.from(a);
        while (test.moveNext()) {
            count++;
        }
        assert.equal(count, len);
    });
    it("strings should enumerate", function () {
        var a = "01234";
        var type = new Types_1.TypeInfo(a);
        type.member("length");
        var len = a.length, count = 0;
        var test = Enumerator.from(a);
        while (test.moveNext()) {
            count++;
        }
        assert.equal(count, len);
    });
    it("array like objects should enumerate", function () {
        var a = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, length: 5 };
        var type = new Types_1.TypeInfo(a);
        type.member("length");
        var len = a.length, count = 0;
        var test = Enumerator.from(a);
        while (test.moveNext()) {
            count++;
        }
        assert.equal(count, len);
    });
});
describe(".forEach(source)", function () {
    var blankAction = function (n, i) { };
    it("null values ignored", function () {
        assert.doesNotThrow(function () {
            assert.equal(Enumerator.forEach(null, blankAction), -1);
        });
    });
    it("non-enumerable values ignored", function () {
        assert.doesNotThrow(function () {
            assert.equal(Enumerator.forEach({}, blankAction), -1);
        });
        assert.doesNotThrow(function () {
            assert.equal(Enumerator.forEach(1, blankAction), -1);
        });
    });
});
//# sourceMappingURL=Enumerator.js.map