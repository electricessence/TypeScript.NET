(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../../source/System/Types", "../../../../../source/System/Collections/Queue", "../../../../../source/System/Collections/Enumeration/Enumerator"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../../../../../source/System/Types");
    var Queue_1 = require("../../../../../source/System/Collections/Queue");
    var Enumerator = require("../../../../../source/System/Collections/Enumeration/Enumerator");
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
            assert.throws(function () { return Enumerator.from((function () { return true; })); });
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
            assert.doesNotThrow(function () { return Enumerator.forEach(null, blankAction); });
        });
        it("non-enumerable values ignored", function () {
            assert.doesNotThrow(function () { return Enumerator.forEach({}, blankAction); });
            assert.doesNotThrow(function () { return Enumerator.forEach(1, blankAction); });
        });
    });
});
//# sourceMappingURL=Enumerator.js.map