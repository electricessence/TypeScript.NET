"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var ArrayEnumerator_1 = require("../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator");
describe("new & .moveNext()", function () {
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
});
//# sourceMappingURL=ArrayEnumerator.js.map