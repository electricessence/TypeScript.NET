"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var Linq_1 = require("../../../dist/commonjs/System.Linq/Linq");
var List_1 = require("../../../dist/commonjs/System/Collections/List");
var CollectionBase_1 = require("../../../dist/commonjs/System/Collections/CollectionBase");
var extends_1 = require("../../../dist/commonjs/extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var A = /** @class */ (function () {
    function A() {
    }
    return A;
}());
var B = /** @class */ (function (_super) {
    __extends(B, _super);
    function B() {
        return _super.call(this) || this;
    }
    return B;
}(A));
describe("Verify instanceof usability", function () {
    it("should work with built in classes", function () {
        assert.ok([] instanceof Array);
    });
    it("should work with standard inheritance", function () {
        assert.ok(new B() instanceof A);
    });
    it("should work same module inheritance", function () {
        assert.ok(new Linq_1.LinqEnumerable((function () { })) instanceof Linq_1.InfiniteLinqEnumerable);
    });
    it("should work cross module inheritance", function () {
        assert.ok(new List_1.List() instanceof CollectionBase_1.CollectionBase);
    });
});
//# sourceMappingURL=instanceof.js.map