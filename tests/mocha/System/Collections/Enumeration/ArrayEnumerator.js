"use strict";
var ArrayEnumerator_1 = require("../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator");
var assert = require('../../../../../node_modules/assert/assert');
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