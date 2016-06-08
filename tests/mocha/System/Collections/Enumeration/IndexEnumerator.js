"use strict";
var IndexEnumerator_1 = require("../../../../../dist/commonjs/System/Collections/Enumeration/IndexEnumerator");
var assert = require('assert');
var VOID0 = void (0);
var a = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 };
it("should ignore null sources", function () {
    assert.doesNotThrow(function () {
        var i = new IndexEnumerator_1.default(function () {
            return {
                source: null,
                pointer: 1,
                length: 3,
                step: 0
            };
        });
        i.moveNext();
    });
    assert.doesNotThrow(function () {
        var i = new IndexEnumerator_1.default(function () {
            return {
                source: null,
                length: 3,
            };
        });
        i.dispose();
    });
});
it("should throw for invalid step", function () {
    assert.throws(function () {
        var i = new IndexEnumerator_1.default(function () {
            return {
                source: a,
                pointer: 1,
                length: 3,
                step: 0
            };
        });
        i.moveNext();
    });
    assert.throws(function () {
        var i = new IndexEnumerator_1.default(function () {
            return {
                source: a,
                pointer: 1,
                length: 3,
                step: 1.2
            };
        });
        i.moveNext();
    });
});
it("should throw for invalid pointer", function () {
    assert.throws(function () {
        var i = new IndexEnumerator_1.default(function () {
            return {
                source: a,
                pointer: 1.3,
                length: 3,
                step: 1
            };
        });
        i.moveNext();
    });
});
it("should throw for invalid length", function () {
    assert.throws(function () {
        var i = new IndexEnumerator_1.default(function () {
            return {
                source: a,
                pointer: 1,
                length: -1,
                step: 1
            };
        });
        i.moveNext();
    });
});
it("should enumerate by 1 with no step", function () {
    var a = [0, 1, 2, 3, 4];
    var len = a.length, count = 0;
    var test = new IndexEnumerator_1.default(function () {
        return {
            source: [0, 1, 2, 3, 4],
            length: 5,
        };
    });
    var last = null;
    while (test.moveNext()) {
        count++;
        last = test.current;
    }
    assert.equal(count, len);
    assert.equal(last, 4);
    test.dispose();
});
//# sourceMappingURL=IndexEnumerator.js.map