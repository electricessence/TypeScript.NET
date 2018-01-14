"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
///<reference types="node"/>
var assert = require("assert");
var StringBuilder_1 = require("../../../../dist/commonjs/System/Text/StringBuilder");
it("should match expected value", function () {
    var sb = new StringBuilder_1.default();
    sb.append("a", "b", "c");
    sb.append("1", "2", "3");
    assert.equal(sb.toString(), "abc123");
});
//# sourceMappingURL=StringBuilder.js.map