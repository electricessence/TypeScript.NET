"use strict";
var assert = require("assert");
var ArrayEnumerator_1 = require("../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator");
it("should allow empty arrays", function () {
    assert.doesNotThrow(function () {
        var i = new ArrayEnumerator_1.default([]);
        i.moveNext();
    });
    assert.doesNotThrow(function () {
        var i = new ArrayEnumerator_1.default(null);
        i.moveNext();
    });
});
//# sourceMappingURL=ArrayEnumerator.js.map