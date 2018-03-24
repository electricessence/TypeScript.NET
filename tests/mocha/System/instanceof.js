"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var Linq_1 = require("../../../dist/umd/Exceptions/Linq");
var List_1 = require("../../../dist/umd/Collections/List");
var CollectionBase_1 = require("../../../dist/umd/Collections/CollectionBase");
var A = /** @class */ (function () {
    function A() {
    }
    return A;
}());
var B = /** @class */ (function (_super) {
    tslib_1.__extends(B, _super);
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
        assert.ok(new List_1.default() instanceof CollectionBase_1.default);
    });
});
//# sourceMappingURL=instanceof.js.map