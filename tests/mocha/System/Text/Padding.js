"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
var Padding_1 = require("../../../../dist/commonjs/System/Text/Padding");
describe('.padLeft()', function () {
    it("should pad to the left", function () {
        assert.equal(Padding_1.padLeft("X", 3, "Y"), "YYX");
        assert.equal(Padding_1.padLeft("X", 3), "  X");
        assert.equal(Padding_1.padLeft(1, 3, 0), "001");
        assert.equal(Padding_1.padLeft(1, 3), "001");
        assert.equal(Padding_1.padLeft(1, 3, 2), "221");
    });
});
describe('.padRight()', function () {
    it("should pad to the right", function () {
        assert.equal(Padding_1.padRight("X", 3, "Y"), "XYY");
        assert.equal(Padding_1.padRight("X", 3), "X  ");
        assert.equal(Padding_1.padRight(1, 3, 0), "100");
        assert.equal(Padding_1.padRight(1, 3), "100");
        assert.equal(Padding_1.padRight(1, 3, 2), "122");
    });
});
//# sourceMappingURL=Padding.js.map